import { z } from "zod";
import { docker } from "../../../clients/docker";
import {
	DeploymentLoggers,
	FileDeploymentLogger,
	MemoryDeploymentLogger,
} from "../../../logs";
import { getBuild, getLatestBuild } from "../../../models/build/get";
import { updateBuildStatus } from "../../../models/build/update";
import { getPortMapping } from "../../../models/port/get";
import { getProjectById } from "../../../models/project/get";
import { updateProjectStatus } from "../../../models/project/update";
import { procedure } from "../../../server/trpc";

const getProjectBuild = (projectId: string, buildId?: string) => {
	return buildId === undefined
		? getLatestBuild(projectId)
		: getBuild(buildId);
};

export const startProcess = procedure
	.input(
		z
			.discriminatedUnion("logToBuild", [
				z.object({
					logToBuild: z.literal(true),
					projectId: z.string(),
					buildId: z.string(),
				}),
				z.object({
					logToBuild: z.literal(false),
					projectId: z.string(),
					buildId: z.string().optional(),
				}),
			])
			.refine(
				({ projectId }) => getProjectById(projectId),
				"Project does not exist."
			)
			.refine(
				({ buildId }) => buildId === undefined || getBuild(buildId),
				"Build request not found."
			)
	)
	.mutation(async ({ input }) => {
		// Discriminated union does not work if destructuring within function parameters.
		const { projectId, buildId, logToBuild } = input;

		const build = await getProjectBuild(projectId, buildId);
		const project = await getProjectById(projectId);

		// These checks are unnecessary.
		if (build === null || project === null) return;

		let logger: MemoryDeploymentLogger | undefined;

		if (logToBuild) {
			logger = await DeploymentLoggers.of(buildId);

			logger.data("START_PROCESS_START", {
				stream: "Starting process.\n",
			});
		}

		const portMappings = await getPortMapping(build.id);
		const bindings = portMappings.reduce<
			Record<string, { HostPort: string }[]>
		>(
			(acc, { internal, external }) => ({
				...acc,
				[internal]: [{ HostPort: String(external) }],
			}),
			{}
		);

		const container = await docker.createContainer({
			name: project.name,
			Image: build.id,
			HostConfig: { PortBindings: bindings },
		});

		await container.start();

		if (logToBuild) {
			logger?.data("START_PROCESS_END", {
				stream: "Started process.\n",
			});
			logger?.end();

			const fileLogger = new FileDeploymentLogger({
				buildId,
				memory: logger,
			});

			fileLogger.save();
		}

		await updateBuildStatus(build.id, true);

		if (logToBuild) {
			DeploymentLoggers.delete(buildId);
		}

		await updateProjectStatus(projectId, "Online");
	});
