import { promote } from "installer";
import { cmd } from "installer/src/utils/cmd";
import minimist from "minimist";
import { VersionSchema } from "./schema";

const run = cmd(VersionSchema, ({ version }) => {
	promote({
		region: "us-east-1",
		bucket: "cereza-admin",
		version,
		files: ["install.sh", "install.ps1"],
	});
});

run(minimist(process.argv.slice(2)) as any);
