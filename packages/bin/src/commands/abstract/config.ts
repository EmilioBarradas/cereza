import { Command } from "@oclif/core";
import { type Config, loadConfig } from "../../utils/config";
import { wrapError } from "../../utils/wrapError";

export default abstract class ConfigCommand extends Command {
	protected installerConfig!: Config;

	protected async init() {
		super.init();

		const config = await wrapError<Config, Error>(loadConfig());

		if (config.failed) {
			this.error(config.error);
		}

		this.installerConfig = config.data;
	}
}
