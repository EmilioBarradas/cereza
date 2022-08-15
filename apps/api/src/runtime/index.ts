import { router } from "@trpc/server";
import z from "zod";
import { prisma } from "database/src";
import { docker } from "../docker";
import { DeploymentLoggers, FileDeploymentLogger } from "../logs";

const getBuildRequest = (buildId: string) => {
    return prisma.buildRequest.findFirst({ where: { id: buildId } });
};

const getProject = (projectId: number) => {
    return prisma.project.findFirst({ where: { id: projectId } });
};

export const runtimeRouter = router()
    .mutation("startService", {
        input: z
            .object({
                projectId: z.number(),
                buildId: z.string(),
            })
            .refine(
                ({ projectId }) => getProject(projectId),
                "Project does not exist."
            )
            .refine(
                ({ buildId }) => getBuildRequest(buildId),
                "Build request not found."
            ),
        resolve: async ({ input: { projectId, buildId } }) => {
            const buildRequest = await getBuildRequest(buildId);
            const project = await getProject(projectId);

            // These checks are unnecessary.
            if (buildRequest === null || project === null) return;

            const logger = await DeploymentLoggers.of(buildId);

            logger.data("START_SERVICE_START");

            const portMappings = await prisma.portMapping.findMany({
                where: {
                    buildRequestId: {
                        equals: buildId,
                    },
                },
            });
            const bindings = portMappings.reduce<
                Record<string, { HostPort: string }[]>
            >(
                (acc, { internal, external }) => ({
                    ...acc,
                    [internal]: [{ HostPort: external }],
                }),
                {}
            );

            const container = await docker.createContainer({
                name: project.name,
                Image: buildRequest.id,
                HostConfig: { PortBindings: bindings },
            });

            await container.start();

            logger.data("START_SERVICE_END");
            logger.end();

            const fileLogger = new FileDeploymentLogger({
                buildId,
                memory: logger,
            });

            fileLogger.save();

            await prisma.buildRequest.update({
                where: {
                    id: buildId,
                },
                data: {
                    finished: true,
                },
            });

            DeploymentLoggers.delete(buildId);
        },
    })
    .mutation("stopService", {
        input: z
            .object({
                projectId: z.number(),
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
                logger.data("STOP_SERVICE_START");
            }

            const container = docker.getContainer(containerInfo.Id);

            await container.stop();
            await container.remove();

            if (logger !== undefined) {
                logger.data("STOP_SERVICE_END");
            }
        },
    });
