import { Command } from "@oclif/core";
import { spawn } from "child_process";

export default class Start extends Command {
	async run() {
		// Need to run web and api.
		const api = spawn("npm", ["run", "dev"], {
			shell: true,
			cwd: "../api",
		});

		const web = spawn("npm", ["run", "dev"], {
			shell: true,
			cwd: "../web",
		});

		api.stdout.on("data", (message) => {
			console.log("[api] " + message.toString());
		});

		web.stdout.on("data", (message) => {
			console.log("[web] " + message.toString());
		});
	}
}
