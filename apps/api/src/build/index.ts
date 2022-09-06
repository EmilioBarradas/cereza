import { router, Subscription } from "@trpc/server";
import { prisma } from "database/src";
import { resolve } from "path";
import z from "zod";
import split from "split";
import { docker } from "../docker";
import { DeploymentLoggers, LogEntry } from "../logs";
import portfinder from "portfinder";

const STORAGE_DIR = "../../storage/uploads";

const getProject = async (projectId: string) => {
	return prisma.project.findFirst({
		where: {
			id: projectId,
		},
	});
};

const getBuild = (buildId: string) => {
	return prisma.build.findFirst({ where: { id: buildId } });
};

const build = async (buildId: string) => {
	const logger = await DeploymentLoggers.of(buildId);
	const buildFile = resolve(STORAGE_DIR, buildId, "data");
	const stream = await docker.buildImage(buildFile, { t: buildId });

	return new Promise<void>((res) => {
		stream
			.pipe(split())
			.on("data", (data: string) => {
				if (data.length === 0) return;
				logger.data("BUILD_DATA", JSON.parse(data));
			})
			.on("end", res);
	});
};

const verifyUniqueProjectPorts = async (
	projectId: string,
	ports: number | number[]
) => {
	const duplicateMapping = await prisma.portMapping.findFirst({
		where: {
			AND: [
				{
					external: {
						in: [ports].flat(),
					},
				},
				{
					build: {
						projectId: {
							not: projectId,
						},
					},
				},
			],
		},
	});

	return duplicateMapping === null;
};

const getUniqueOSPort = async (suggestedPort: number) => {
	return portfinder.getPortPromise({ port: suggestedPort });
};

const getUniquePort = async (
	projectId: string,
	suggestedPort: number
): Promise<number> => {
	const osPort = await getUniqueOSPort(suggestedPort);
	const isAvailable = await verifyUniqueProjectPorts(projectId, osPort);

	return isAvailable ? osPort : getUniquePort(projectId, osPort + 1);
};

export const buildRouter = router()
	.query("getBuilds", {
		input: z.string().refine(getProject, "Project not found."),
		resolve: ({ input: projectId }) => {
			return prisma.build.findMany({
				where: {
					projectId,
				},
			});
		},
	})
	.query("getBuild", {
		input: z.string().refine(getBuild, "Build request not found."),
		resolve: ({ input: buildId }) => {
			return prisma.build.findFirst({
				where: {
					id: buildId,
				},
			});
		},
	})
	.mutation("createBuild", {
		input: z.string().refine(getProject, "Project not found."),
		resolve: async ({ input: projectId }) => {
			const { id } = await prisma.build.create({
				data: {
					projectId,
				},
			});

			DeploymentLoggers.create(id);

			return id;
		},
	})
	.mutation("build", {
		input: z
			.object({
				projectId: z.string(),
				buildId: z.string(),
				ports: z.record(z.number()),
			})
			.refine(
				({ buildId }) => getBuild(buildId),
				"Build request not found."
			)
			.refine(
				({ projectId, ports }) =>
					verifyUniqueProjectPorts(projectId, Object.values(ports)),
				"One or more of the specified ports are used by an existing application."
			),
		resolve: async ({ input: { projectId, buildId, ports } }) => {
			const _build = await getBuild(buildId);

			// This check is unnecessary.
			if (_build == null) return "";

			await build(buildId);

			const toNum = (str: string) => Number(str.replace(/\D/g, ""));
			const getPortFromInternal = (internal: string) =>
				getUniquePort(projectId, toNum(internal));
			const getExternalPort = async (internal: string) =>
				ports[internal] ?? getPortFromInternal(internal);

			const imageInfo = await docker.getImage(buildId).inspect();
			const exposedPorts = Object.keys(imageInfo.Config.ExposedPorts);
			const portMappings = exposedPorts.map(async (internal) => ({
				internal,
				external: await getExternalPort(internal),
			}));

			await prisma.build.update({
				where: {
					id: _build.id,
				},
				data: {
					ports: {
						create: await Promise.all(portMappings),
					},
				},
			});
		},
	})
	.subscription("onBuildLog", {
		input: z.string().refine(getBuild, "Build request not found."),
		resolve: ({ input: buildId }) => {
			const sub = new Subscription<LogEntry>(async (emitter) => {
				const logger = await DeploymentLoggers.of(buildId);

				(async () => {
					for await (const log of logger) {
						emitter.data(log);
					}

					sub.destroy();
				})();

				return () => {};
			});

			return sub;
		},
	});
