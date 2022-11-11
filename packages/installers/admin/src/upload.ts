import { upload } from "installer";
import { cmd } from "installer/src/utils/cmd";
import { VersionSchema } from "./schema";
import minimist from "minimist";

const run = cmd(VersionSchema, ({ version }) => {
	upload({
		region: "us-east-1",
		bucket: "cereza-admin",
		version,
		dir: "dist",
	});
});

run(minimist(process.argv.slice(2)) as any);
