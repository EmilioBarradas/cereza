import { CliUx, Command } from "@oclif/core";
import { CerezaProcess } from "client";
import { loadConfig } from "../config.js";

export default class StartProcess extends Command {
	static description = "Start the application.";

	async run() {
		const config = await loadConfig();
		const process = new CerezaProcess(config);

		const isRunning = await process.isRunning();

		if (isRunning) {
			this.error("Process is already running.");
		}

		CliUx.ux.action.start("Starting process");

		await process.start();

		CliUx.ux.action.stop("Done");
	}
}
