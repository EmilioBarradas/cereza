import { pack } from "installer";
import { cmd } from "installer/src/utils/cmd";
import { VersionSchema } from "./schema";
import minimist from "minimist";

const run = cmd(VersionSchema, () => {
	pack({
		templateDirs: ["templates"],
		staticDirs: ["static"],
		outDir: "dist",
		data: process.argv.slice(2),
	});
});

run(minimist(process.argv.slice(2)) as any);
