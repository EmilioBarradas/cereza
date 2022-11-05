import { Build } from "@prisma/client";
import { prisma } from "../clients/prisma";
import { FileDeploymentLogger } from "./loggers/file";
import { MemoryDeploymentLogger } from "./loggers/memory";

export class DeploymentLoggers {
	private static readonly loggers = new Map<string, MemoryDeploymentLogger>();

	static async of(buildId: string) {
		const build = await prisma.build.findFirst({
			where: { id: buildId },
		});

		if (build === null) throw new Error("Build not found.");

		return this.loadLogger(build);
	}

	static create(buildId: string) {
		this.loggers.set(buildId, new MemoryDeploymentLogger());
	}

	static delete(buildId: string) {
		this.loggers.delete(buildId);
	}

	private static async loadLogger({ finished, id }: Build) {
		return finished ? this.loadFileLogger(id) : this.loadMemoryLogger(id);
	}

	private static async loadFileLogger(buildId: string) {
		const logger = new FileDeploymentLogger({ buildId });

		await logger.load();
		logger.end();

		return logger;
	}

	private static loadMemoryLogger(buildId: string) {
		const logger = DeploymentLoggers.loggers.get(buildId);

		if (logger === undefined)
			throw new Error("Deployment logger not found.");

		return logger;
	}
}

export { FileDeploymentLogger } from "./loggers/file";
export { MemoryDeploymentLogger } from "./loggers/memory";
export type { LogEntry } from "./types";
