import { pack } from "installer";
import { cmd } from "installer/src/utils/cmd";
import { VersionSchema } from "./schema";
import minimist from "minimist";

const run = cmd(VersionSchema, (data) => {
	pack({
		templateDirs: ["templates"],
		staticDirs: ["static"],
		outDir: "dist",
		data,
	});
});

run(minimist(process.argv.slice(2)) as any);
