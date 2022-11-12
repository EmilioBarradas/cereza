import { pack } from "box";
import minimist from "minimist";
import VersionCommand from "../abstract/version";

export default class Package extends VersionCommand {
	static strict = false;

	async run() {
		const {
			flags: { version },
			argv,
		} = await this.parse(Package);
		const { templateDirs, staticDirs, outDir } = this.boxConfig.pack;

		await pack({
			templateDirs,
			staticDirs,
			outDir,
			data: { ...minimist(argv), version },
		});
	}
}
