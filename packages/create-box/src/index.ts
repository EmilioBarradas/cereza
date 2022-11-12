#!/usr/bin/env node
import inquirer from "inquirer";
import { mkdir, cp } from "fs/promises";
import { resolve, basename } from "path";
import { fileURLToPath } from "url";
import { maiz } from "maiz";
import chalk from "chalk";
import { wrapError } from "./wrapError.js";

interface Options {
	path: string;
	awsRegion: string;
	awsBucket: string;
}

const prompt = () => {
	return inquirer.prompt<Options>([
		{
			name: "path",
			message: "Application Directory",
			default: "./",
			filter: (input: string) => resolve(input),
		},
		{
			name: "awsRegion",
			message: "AWS Region",
			validate: (input: string) =>
				input.length == 0 ? "AWS region is required." : true,
		},
		{
			name: "awsBucket",
			message: "AWS Bucket",
			validate: (input: string) =>
				input.length == 0 ? "AWS bucket is required." : true,
		},
	]);
};

const MODULE_ROOT = resolve(fileURLToPath(import.meta.url), "../..");

const copyStubs = async (files: string[], out: string) => {
	const cpPromises = files.map(async (file) => {
		const cpRes = await wrapError(
			cp(
				resolve(MODULE_ROOT, "stubs", file),
				resolve(out, file.replaceAll(".stub.", "."))
			)
		);

		if (!cpRes.failed) return;

		throw new Error(`Could not copy stub file: ${file}`);
	});

	await Promise.allSettled(cpPromises);
};

const main = async () => {
	const { path, awsRegion, awsBucket } = await prompt();

	await mkdir(path, { recursive: true });
	await mkdir(resolve(path, "templates"));
	await mkdir(resolve(path, "static"));

	await copyStubs(["box.stub.js", "package.stub.json"], path);

	await maiz({
		inDir: path,
		outDir: path,
		data: { name: basename(path), awsRegion, awsBucket },
	});

	const { blueBright } = chalk;

	console.log(`\nCreated box in ${blueBright(path)}.`);
	console.log(
		`\nRun ${blueBright("npm install")}, ${blueBright(
			"yarn install"
		)}, or ${blueBright(
			"pnpm install"
		)} in the directory to install required dependencies.\n`
	);
};

main();
