import { router } from "@trpc/server";
import { prisma } from "database";
import z from "zod";
import { docker } from "../docker";
import {
	DeploymentLoggers,
	FileDeploymentLogger,
	MemoryDeploymentLogger,
} from "../logs";

const getProject = (projectId: string) => {
	return prisma.project.findFirst({
		where: { id: projectId },
		include: { status: true },
	});
};

const getLatestBuild = (projectId: string) => {
	return prisma.build.findFirst({
		where: {
			projectId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};

const getBuild = (buildId: string) => {
	return prisma.build.findFirst({ where: { id: buildId } });
};

const getProjectBuild = (projectId: string, buildId?: string) => {
	return buildId === undefined
		? getLatestBuild(projectId)
		: getBuild(buildId);
};

export const runtimeRouter = router()
	.query("getProcessStatus", {
		input: z.string().refine(getProject, "Project not found."),
		resolve: async ({ input: projectId }) => {
			const project = await getProject(projectId);

			// This check is unnecessary.
			if (project === null) return;

			return project.status;
		},
	})
	.mutation("startProcess", {
		input: z
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
				({ projectId }) => getProject(projectId),
				"Project does not exist."
			)
			.refine(
				({ buildId }) => buildId === undefined || getBuild(buildId),
				"Build request not found."
			),
		resolve: async ({ input }) => {
			// Discriminated union does not work if destructuring within function parameters.
			const { projectId, buildId, logToBuild } = input;

			const build = await getProjectBuild(projectId, buildId);
			const project = await getProject(projectId);

			// These checks are unnecessary.
			if (build === null || project === null) return;

			let logger: MemoryDeploymentLogger | undefined;

			if (logToBuild) {
				logger = await DeploymentLoggers.of(buildId);

				logger.data("START_PROCESS_START", {
					stream: "Starting process.\n",
				});
			}

			const portMappings = await prisma.portMapping.findMany({
				where: {
					buildId: {
						equals: buildId,
					},
				},
			});
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

			if (buildId !== undefined) {
				await prisma.build.update({
					where: {
						id: buildId,
					},
					data: {
						finished: true,
					},
				});
			}

			if (logToBuild) {
				DeploymentLoggers.delete(buildId);
			}

			await prisma.project.update({
				where: {
					id: projectId,
				},
				data: {
					status: {
						update: {
							value: "Online",
						},
					},
				},
			});
		},
	})
	.mutation("stopProcess", {
		input: z
			.object({
				projectId: z.string(),
				buildId: z.string().optional(),
			})
			.refine(
				({ projectId }) => getProject(projectId),
				"Project does not exist."
			),
		resolve: async ({ input: { projectId, buildId } }) => {
			const project = await getProject(projectId);

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

			await prisma.project.update({
				where: {
					id: projectId,
				},
				data: {
					status: {
						update: {
							value: "Offline",
						},
					},
				},
			});
		},
	});
