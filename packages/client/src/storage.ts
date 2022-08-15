import { default as axios } from "axios";
import { join } from "path";
import { readFileElseEmpty } from "./utils/fs";
import { buildTar } from "./utils/tar";

const getIgnoreGlobs = async (dir: string) => {
    const gitIgnorePath = join(dir, ".gitignore");
    const fileContents = await readFileElseEmpty(gitIgnorePath);
    const globs = fileContents.split(/\r?\n/);
    const filteredGlobs = globs.filter((glob) => glob.length > 0);

    return filteredGlobs;
};

export const uploadDir = async (dir: string, buildId: string) => {
    const ignore = await getIgnoreGlobs(dir);
    const stream = await buildTar(dir, { ignore });

    await axios.post<{ success: true; data: {} }>(
        "http://localhost:59213/api/upload",
        stream,
        {
            headers: {
                "Content-Type": "application/octet-stream",
                "Build-ID": buildId,
            },
            maxBodyLength: Infinity,
        }
    );
};
