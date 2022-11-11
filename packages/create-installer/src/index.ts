#!/usr/bin/env node
import inquirer from "inquirer";
import { mkdir, cp } from "fs/promises";
import { resolve } from "path";
import { fileURLToPath } from "url";
import maiz from "maiz";

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

const main = async () => {
	const { path, awsRegion, awsBucket } = await prompt();

	await mkdir(path, { recursive: true });

	await cp(
		resolve(MODULE_ROOT, "stubs", "installer.stub.js"),
		"installer.js"
	);

	await maiz({
		inDir: ".",
		outDir: ".",
		data: { awsRegion, awsBucket },
	});

	// Run maiz using awsRegion and awsBucket.

	// Create templates directory.
	// Create static directory.

	console.log("Done.");
};

main();
