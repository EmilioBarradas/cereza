import { render } from "art-template";
import { mkdir, writeFile, readFile } from "fs/promises";
import { dirname } from "path";

interface Options extends Record<string, Options | string> {}

export const template = async (
	templatePath: string,
	generatedPath: string,
	options: Options = {}
) => {
	const contents = await readFile(templatePath, "utf-8");
	const generated = render(contents, options);

	await mkdir(dirname(generatedPath), { recursive: true });
	await writeFile(generatedPath, generated);
};
