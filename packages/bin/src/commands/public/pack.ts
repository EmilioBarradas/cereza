import { pack } from "installer";
import VersionCommand from "../abstract/version";

export default class Pack extends VersionCommand {
	async run() {
		const { flags } = await this.parse(Pack);
		const { templateDirs, staticDirs, outDir } = this.installerConfig.pack;

		await pack({ templateDirs, staticDirs, outDir, data: flags });
	}
}
