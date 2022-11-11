import VersionCommand from "../abstract/version";
import { promote } from "installer";

export default class Promote extends VersionCommand {
	async run() {
		const {
			flags: { version },
		} = await this.parse(Promote);
		const {
			aws: { region, bucket },
			promote: { paths },
		} = this.installerConfig;

		await promote({ region, bucket, version, paths });
	}
}
