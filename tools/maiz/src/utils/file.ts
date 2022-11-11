import { readdir, lstat } from "fs/promises";
import { join } from "path";
import { wrapError } from "./wrapError";

export const getFiles = async (path: string) => {
	const entries = await readdir(path, { withFileTypes: true });
	const files = entries.filter((entry) => entry.isFile());
	const paths = files.map(({ name }) => join(path, name));

	return paths;
};

export const isDirectory = async (path: string) => {
	const res = await wrapError(lstat(path));

	return !res.failed && !res.data.isFile();
};
