import { Command, Flags } from "@oclif/core";
import { deployProject } from "client/src";
import DeploymentLogger from "client/src/logger";
import { resolve, basename } from "path";

const generateName = (directory: string) => {
	return basename(resolve(directory));
};

const printDeploymentLogs = async (logger: DeploymentLogger) => {
	for await (const value of logger) {
		// console.log(value);
	}
};

export default class Deploy extends Command {
	static args = [{ name: "directory", default: "." }, { name: "name" }];

	static flags = {
		directory: Flags.string({
			char: "D",
		}),
		name: Flags.string({
			char: "N",
		}),
	};

	async run() {
		const { args, flags } = await this.parse(Deploy);

		const directory = args.directory ?? flags.directory;
		const name = args.name ?? flags.name ?? generateName(directory);

		const { build } = await deployProject({
			name,
			directory,
			build: {
				ports: {
					"3000/tcp": "3000",
				},
			},
		});

		this.log(`http://localhost:3001/project/${name}/build/${build.id}`);

		await printDeploymentLogs(build.logger);
	}
}
