import { z } from "zod";
import { docker } from "../../../clients/docker";
import { DeploymentLoggers } from "../../../logs";
import { getProjectById } from "../../../models/project/get";
import { updateProjectStatus } from "../../../models/project/update";
import { procedure } from "../../../server/trpc";

export const stopProcess = procedure
	.input(
		z
			.object({
				projectId: z.string(),
				buildId: z.string().optional(),
			})
			.refine(
				({ projectId }) => getProjectById(projectId),
				"Project does not exist."
			)
	)
	.mutation(async ({ input: { projectId, buildId } }) => {
		const project = await getProjectById(projectId);

		// This check is unnecessary.
		if (project === null) return;

		const containerInfos = await docker.listContainers();
		const containerInfo = containerInfos.find((info) =>
			info.Names.includes(`/${project.name}`)
		);

		if (containerInfo === undefined) return;

		const logger =
			buildId !== undefined
				? await DeploymentLoggers.of(buildId)
				: undefined;

		if (logger !== undefined) {
			logger.data("STOP_PROCESS_START", {
				stream: "Stopping existing process.\n",
			});
		}

		const container = docker.getContainer(containerInfo.Id);

		await container.stop();
		await container.remove();

		if (logger !== undefined) {
			logger.data("STOP_PROCESS_END", {
				stream: "Stopped existing process.\n",
			});
		}

		await updateProjectStatus(projectId, "Offline");
	});
