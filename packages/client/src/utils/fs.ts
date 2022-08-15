import { readdir } from "fs/promises";
import { join } from "path/posix";
import { existsSync } from "fs";
import { readFile } from "fs/promises";

export const readFileElseEmpty = async (path: string) => {
    return existsSync(path) ? await readFile(path, "utf-8") : "";
};

export const walkDir = async (
    basePath: string,
    fileCallback = (fileName: string) => {},
    prefix = ""
) => {
    const files = await readdir(basePath, {
        encoding: "binary",
        withFileTypes: true,
    });

    const promises = files.map((file) => {
        if (file.isSymbolicLink()) return;

        const prefixedName = join(prefix, file.name);

        if (file.isDirectory()) {
            return walkDir(
                join(basePath, file.name),
                fileCallback,
                prefixedName
            );
        }

        fileCallback(prefixedName);
    });

    await Promise.allSettled(promises);
};
