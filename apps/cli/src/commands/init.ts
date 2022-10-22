import { Command, Flags } from "@oclif/core";
import { CerezaProject, CerezaServer } from "client/src/index.js";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import { basename, resolve } from "path";
import inquirer from "inquirer";
import { getAvailableServers, getToken } from "../config.js";
import decodeJwt from "jwt-decode";

const getBaseName = (directory: string) => {
	return basename(resolve(directory));
};

const CONFIG_TEMPLATE = `
export default {
    id: $id,
    name: $name,
    server: $server,
};
`.trim();

const fillTemplate = (template: string, values: Record<string, any>) => {
	for (const [key, value] of Object.entries(values)) {
		template = template.replace(`$${key}`, `"${value}"`);
	}
	return template;
};

const validateCreate = (path: string, force: boolean, command: Command) => {
	if (!existsSync(path) || force) return;

	command.error("Cereza configuration file already exists.");
};

const getDefaults = () => {
	return { name: getBaseName(".") };
};

const prompt = async (cmd: Command) => {
	const defaults = getDefaults();
	const servers = await getAvailableServers();

	if (servers.length === 0) {
		cmd.error(
			"You are not logged in to any servers.\n" +
				`Use "cereza login" to log in to a server.\n` +
				`Use "cereza signup" to create a new account on a server.`
		);
	}

	const initialAnswers = await inquirer.prompt<{
		server: string;
		existing: boolean;
	}>([
		{
			type: "list",
			name: "server",
			message: "What server should be deployed to?",
			choices: servers,
		},
		{
			type: "confirm",
			name: "existing",
			message: "Would you like to connect to an existing project?",
		},
	]);

	const server = new CerezaServer({ server: initialAnswers.server });
	const projects: { id: string; name: string }[] = initialAnswers.existing
		? await server.getProjects()
		: [];

	const answers = await inquirer.prompt<{
		server: string;
		existing: boolean;
		existingName: string;
		create: boolean;
		creatingName: string;
	}>(
		[
			{
				type: "list",
				name: "existingName",
				message: "Which project would you like to connect to?",
				choices: () => projects.map(({ name }) => name),
				when: ({ existing }) => existing && projects.length > 0,
			},
			{
				type: "confirm",
				name: "create",
				message:
					"No projects found. Would you like to create one instead?",
				when: ({ existing }) => existing && projects.length === 0,
			},
			{
				name: "creatingName",
				message: "What do you want to name this project?",
				default: defaults.name,
				when: ({ existing, create }) => !existing || create,
				validate: async (name, answers) => {
					if (answers === undefined) return true;

					const project = new CerezaProject({
						server: answers.server,
						name,
					});

					return (
						!(await project.exists()) ||
						"A project with that name already exists."
					);
				},
			},
		],
		initialAnswers
	);

	const getOrCreateProject = async (userId: string) => {
		const name = answers.existingName ?? answers.creatingName;

		let project = projects.find(
			({ name: curName }: { name: string }) => curName == name
		);

		if (project === undefined) {
			const cerezaProject = new CerezaProject({
				server: answers.server,
				name,
				userId,
			});

			project = await cerezaProject.create();
		}

		return project;
	};

	const { userId } = await getToken(answers.server);

	return { ...answers, ...(await getOrCreateProject(userId)) };
};

export default class Init extends Command {
	static description = "Initialize a new project.";

	static flags = {
		force: Flags.boolean(),
	};

	async run() {
		const {
			flags: { force },
		} = await this.parse(Init);

		const configPath = "./cereza.config.js";

		validateCreate(configPath, force, this);

		await writeFile(
			configPath,
			fillTemplate(CONFIG_TEMPLATE, await prompt(this))
		);

		this.log("Created Cereza configuration file.");
	}
}
