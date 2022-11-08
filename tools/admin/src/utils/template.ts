import artTemplate from "art-template";
import chalk from "chalk";
import { mkdir, readdir, writeFile } from "fs/promises";
import { basename, dirname, join, resolve } from "path";
import { process } from "./process";

interface Options extends Record<string, Options | string> {}

export const template = async (
	templatePath: string,
	generatedPath: string,
	options: Options = {}
) => {
	const generated = artTemplate(resolve(templatePath), options);

	await mkdir(dirname(generatedPath), { recursive: true });
	await writeFile(generatedPath, generated);

	await new Promise((res) => setTimeout(res, 5000));
};

export const templates = async (
	inDir: string,
	outDir: string,
	options: Options = {}
) => {
	console.log(chalk.underline("Template Generation"));

	const files = await getFiles(inDir);
	const processes = files.map((path) => {
		const outPath = join(outDir, basename(path));

		return process(`  ${outPath}`, () => template(path, outPath, options));
	});

	await Promise.allSettled(processes);
};

const getFiles = async (dir: string) => {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = entries.filter((entry) => entry.isFile());
	const paths = files.map(({ name }) => join(dir, name));

	return paths;
};
