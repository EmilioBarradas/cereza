import { Command } from "@oclif/core";

export default class Init extends Command {
	async run() {
		this.log("Hello World!");
	}
}
