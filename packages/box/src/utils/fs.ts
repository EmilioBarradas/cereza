import { readdir } from "fs/promises";
import { join } from "path";

export const walkDir = async (
	path: string,
	fileCallback = (path: string) => {}
) => {
	const files = await readdir(path, {
		encoding: "binary",
		withFileTypes: true,
	});

	const promises = files.map((file) => {
		if (file.isSymbolicLink()) return;

		const filePath = join(path, file.name);

		if (file.isFile()) {
			return fileCallback(filePath);
		}

		return walkDir(filePath, fileCallback);
	});

	await Promise.allSettled(promises);
};
