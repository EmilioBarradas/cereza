import { Command } from "@oclif/core";
import { CerezaBuild } from "client";
import { resolve } from "path";
import { loadConfig } from "../config.js";

export default class Deploy extends Command {
	static description = "Deploy a new version of the application.";

	async run() {
		const config = await loadConfig();
		const project = new CerezaBuild(config);

		const { buildId } = await project.build({
			directory: resolve("."),
			build: {
				ports: config.ports,
			},
		});

		this.log(
			`http://localhost:3000/projects/${config.name}/builds/${buildId}`
		);
	}
}
