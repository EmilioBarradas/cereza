import { router, Subscription } from "@trpc/server";
import { prisma } from "database/src";
import { resolve } from "path";
import z from "zod";
import split from "split";
import { docker } from "../docker";
import { DeploymentLoggers, LogEntry } from "../logs";

const STORAGE_DIR = "../../storage/uploads";

const getProject = (projectId: number) => {
    return prisma.project.findFirst({
        where: {
            id: projectId,
        },
    });
};

const getBuildRequest = (buildId: string) => {
    return prisma.buildRequest.findFirst({ where: { id: buildId } });
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

const verifyUniquePorts = async (
    projectId: number,
    ports: Record<string, string>
) => {
    const duplicateMapping = await prisma.portMapping.findFirst({
        where: {
            AND: [
                {
                    external: {
                        in: Object.values(ports),
                    },
                },
                {
                    buildRequest: {
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

export const buildRouter = router()
    .query("getBuilds", {
        input: z.number().refine(getProject, "Project not found."),
        resolve: ({ input: projectId }) => {
            return prisma.buildRequest.findMany({
                where: {
                    projectId,
                },
            });
        },
    })
    .query("getBuild", {
        input: z.string().refine(getBuildRequest, "Build request not found."),
        resolve: ({ input: buildId }) => {
            return prisma.buildRequest.findFirst({
                where: {
                    id: buildId,
                },
            });
        },
    })
    .mutation("createBuildRequest", {
        input: z.number().refine(getProject, "Project not found."),
        resolve: async ({ input: projectId }) => {
            const { id } = await prisma.buildRequest.create({
                data: {
                    projectId: Number(projectId),
                },
            });

            DeploymentLoggers.create(id);

            return id;
        },
    })
    .mutation("build", {
        input: z
            .object({
                projectId: z.number(),
                buildId: z.string(),
                ports: z.record(z.string(), z.string()),
            })
            .refine(
                ({ buildId }) => getBuildRequest(buildId),
                "Build request not found."
            )
            .refine(
                ({ projectId, ports }) => verifyUniquePorts(projectId, ports),
                "One or more of the specified ports are used by an existing application."
            ),
        resolve: async ({ input: { buildId, ports } }) => {
            const buildRequest = await getBuildRequest(buildId);

            // This check is unnecessary.
            if (buildRequest == null) return "";

            await build(buildId);

            const imageInfo = await docker.getImage(buildId).inspect();

            const usedPorts = Object.keys(imageInfo.Config.ExposedPorts)
                .filter((port) => ports[port] !== undefined)
                .map((port) => ({
                    internal: port,
                    external: ports[port],
                }));

            await prisma.buildRequest.update({
                where: {
                    id: buildRequest.id,
                },
                data: {
                    ports: {
                        create: usedPorts,
                    },
                },
            });
        },
    })
    .subscription("onBuildLog", {
        input: z.string().refine(getBuildRequest, "Build request not found."),
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
