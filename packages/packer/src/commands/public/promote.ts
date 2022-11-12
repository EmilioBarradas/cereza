import { promote } from "box";
import VersionCommand from "../abstract/version";

export default class Promote extends VersionCommand {
	async run() {
		const {
			flags: { version },
		} = await this.parse(Promote);
		const {
			aws: { region, bucket },
			promote: { paths },
		} = this.boxConfig;

		await promote({ region, bucket, version, paths });
	}
}
