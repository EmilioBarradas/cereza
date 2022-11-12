import VersionCommand from "../abstract/version";
import { upload } from "box";

export default class Upload extends VersionCommand {
	async run() {
		const {
			flags: { version },
		} = await this.parse(Upload);
		const {
			aws: { region, bucket },
			upload: { inDir },
		} = this.boxConfig;

		await upload({ region, bucket, version, inDir });
	}
}
