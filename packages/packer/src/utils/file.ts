import { wrapError } from "./wrapError";
import { lstat } from "fs/promises";

export const fileExists = async (path: string) => {
	return !(await wrapError(lstat(path))).failed;
};
