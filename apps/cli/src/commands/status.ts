import { Command } from "@oclif/core";
import chalk from "chalk";
import { CerezaProcess } from "client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import format from "string-template";
import { configExists, loadConfig, loadDecodedTokens } from "../config.js";

dayjs.extend(relativeTime);

const CLI_STATUS_TEMPLATE = `
{0}
{1}
`;

const PROJECT_STATUS_TEMPLATE = `
{statusSymbol} {name}
  ID:     {id}
  Status: {status}
          {statusSince}
  Server: {server}
`;

export default class ProcessStatus extends Command {
	static description = "Display the status of the application.";

	async getCliStatus() {
		const tokens = await loadDecodedTokens();
		const lines = Object.entries(tokens).map(
			([server, { username }]) => `  ${server}: ${username}`
		);

		return lines.length > 0
			? format(
					CLI_STATUS_TEMPLATE,
					chalk.bold("  Servers"),
					lines.join("\n")
			  )
			: "";
	}

	async getProjectStatus() {
		if (!configExists()) return "";

		const config = await loadConfig();
		const process = new CerezaProcess(config);
		const processStatus = await process.getStatus();

		if (processStatus === undefined) return "";

		const { updatedAt, value: status } = processStatus;

		return format(PROJECT_STATUS_TEMPLATE, {
			statusSymbol:
				status === "Online" ? chalk.green("●") : chalk.red("●"),
			name: chalk.bold(config.name),
			id: config.id,
			status: chalk[status === "Online" ? "greenBright" : "redBright"](
				status
			),
			statusSince: chalk.gray(dayjs(updatedAt).fromNow()),
			server: config.server,
		});
	}

	async run() {
		const cliStatus = await this.getCliStatus();
		const projectStatus = await this.getProjectStatus();

		const sections = [cliStatus, projectStatus].filter(
			(status) => status.length > 0
		);

		if (sections.length == 0) {
			this.error("No information to show.");
		}

		this.log(sections.join(chalk.gray(`\n${"─".repeat(32)}\n`)));
	}
}
