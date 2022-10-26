import { Command } from "@oclif/core";
import chalk from "chalk";
import { spawn } from "child_process";

const APP_TEXT = `
     .d8888b.                                            
    d88P  Y88b                                           
    888    888                                           
    888         .d88b.  888d888 .d88b. 88888888  8888b.  
    888        d8P  Y8b 888P"  d8P  Y8b   d88P      "88b 
    888    888 88888888 888    88888888  d88P   .d888888 
    Y88b  d88P Y8b.     888    Y8b.     d88P    888  888 
     "Y8888P"   "Y8888  888     "Y8888 88888888 "Y888888 
`;

export default class Start extends Command {
	async run() {
		this.print(APP_TEXT, chalk.gray("cli"));

		const nodePath = process.argv[0];

		const api = spawn(nodePath, ["."], {
			shell: true,
			cwd: process.env.API_PATH,
		});

		const web = spawn(nodePath, ["server.js"], {
			shell: true,
			cwd: process.env.WEB_PATH,
		});

		api.stderr.on("data", (message) =>
			this.print(message.toString(), chalk.greenBright("api"))
		);
		api.stdout.on("data", (message) =>
			this.print(message.toString(), chalk.greenBright("api"))
		);

		web.stderr.on("data", (message) =>
			this.print(message.toString(), chalk.magentaBright("web"))
		);
		web.stdout.on("data", (message) =>
			this.print(message.toString(), chalk.magentaBright("web"))
		);
	}

	private print(message: string, prefix: string) {
		const lines = message.toString().split("\n");

		for (const line of lines) {
			this.log(`${chalk.bold(prefix)} ${line}`);
		}
	}
}
