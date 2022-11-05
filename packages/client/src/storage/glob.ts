import { join } from "path";
import { readFileElseEmpty } from "../utils/fs";

export const getIgnoreGlobs = async (dir: string) => {
	const gitIgnorePath = join(dir, ".gitignore");
	const fileContents = await readFileElseEmpty(gitIgnorePath);
	const globs = fileContents.split(/\r?\n/);
	const filteredGlobs = globs.filter((glob) => glob.length > 0);

	return filteredGlobs;
};
