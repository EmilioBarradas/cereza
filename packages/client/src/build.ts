import { CompleteCerezaConfig, CompleteCerezaConfigSchema } from "./cereza.js";
import DeploymentLogger from "./logger.js";
import { uploadDir } from "./storage.js";
import { connectToWsApi, httpApi, wrapTRPC } from "./trpc.js";

interface DeployOptions {
	projectId: string;
	directory: string;
	ports: { [internal: string]: number };
	logger: DeploymentLogger;
}

const build = async (options: {
	projectId: string;
	buildId: string;
	ports: Record<string, number>;
}) => {
	await wrapTRPC(httpApi.mutation("build", options));
};

const stopProcess = async (projectId: string, buildId?: string) => {
	await wrapTRPC(httpApi.mutation("stopProcess", { projectId, buildId }));
};

const startProcess = async (options: {
	projectId: string;
	buildId: string;
}) => {
	await wrapTRPC(
		httpApi.mutation("startProcess", { ...options, logToBuild: true })
	);
};

const createBuild = async (projectId: string) => {
	return wrapTRPC(httpApi.mutation("createBuild", projectId));
};

const deploy = async ({
	projectId,
	buildId,
	directory,
	ports,
}: Omit<DeployOptions, "logger"> & { buildId: string }) => {
	await uploadDir(directory, buildId);
	await build({ projectId, buildId, ports });
	await stopProcess(projectId, buildId);
	await startProcess({ projectId, buildId });
};

const relayLogs = (buildId: string, logger: DeploymentLogger) => {
	const { wsApi, socket } = connectToWsApi();

	wsApi.subscription("onBuildLog", buildId, {
		onNext: (subData) => {
			if (subData.type !== "data") return;
			logger.entry(subData.data);
		},
		onDone: () => {
			socket.close();
		},
	});
};

const startDeployment = async ({
	projectId,
	directory,
	ports,
	logger,
}: DeployOptions) => {
	const buildId = await createBuild(projectId);

	relayLogs(buildId, logger);
	deploy({ projectId, buildId, directory, ports });

	return buildId;
};

export class CerezaBuild {
	constructor(private readonly config: CompleteCerezaConfig) {
		CompleteCerezaConfigSchema.parse(this.config);
	}

	public async build({
		directory,
		build: { ports },
	}: {
		directory: string;
		build: { ports: Record<string, number> };
	}) {
		const logger = new DeploymentLogger();

		const buildId = await startDeployment({
			projectId: this.config.id,
			directory,
			ports,
			logger,
		});

		return { buildId, logger };
	}
}
