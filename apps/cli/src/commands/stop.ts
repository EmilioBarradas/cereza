import { CliUx, Command } from "@oclif/core";
import { CerezaProcess } from "client/src/index";
import { loadConfig } from "../config";

export default class StopProcess extends Command {
	static description = "Stop the application.";

	async run() {
		const config = await loadConfig();
		const process = new CerezaProcess(config);

		const isRunning = await process.isRunning();

		if (!isRunning) {
			this.error("Process is not running.");
		}

		CliUx.ux.action.start("Stopping process");

		await process.stop();

		CliUx.ux.action.stop("Done");
	}
}
