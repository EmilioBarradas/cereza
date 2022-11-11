import VersionCommand from "../abstract/version";
import { upload } from "installer";

export default class Upload extends VersionCommand {
	async run() {
		const {
			flags: { version },
		} = await this.parse(Upload);
		const {
			aws: { region, bucket },
			upload: { inDir },
		} = this.installerConfig;

		await upload({ region, bucket, version, inDir });
	}
}
