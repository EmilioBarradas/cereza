import { readdir } from "fs/promises";
import { join } from "path";

export const getFiles = async (path: string) => {
	const entries = await readdir(path, { withFileTypes: true });
	const files = entries.filter((entry) => entry.isFile());
	const paths = files.map(({ name }) => join(path, name));

	return paths;
};
