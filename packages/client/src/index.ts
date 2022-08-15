import z from "zod";
import DeploymentLogger from "./logger.js";
import { uploadDir } from "./storage.js";
import { connectToWsApi, httpApi } from "./trpc.js";

const createProject = async (name: string) => {
    return httpApi.mutation("createProject", name);
};

const build = async (options: {
    projectId: number;
    buildId: string;
    ports: Record<string, string>;
}) => {
    await httpApi.mutation("build", options);
};

const stopService = async (projectId: number, buildId?: string) => {
    await httpApi.mutation("stopService", { projectId, buildId });
};

const startService = async (options: {
    projectId: number;
    buildId: string;
}) => {
    await httpApi.mutation("startService", options);
};

const getProject = (name: string) => {
    return httpApi.query("getProject", name);
};

interface DeployOptions {
    projectId: number;
    directory: string;
    ports: { [internal: string]: string };
    logger: DeploymentLogger;
}

const ProjectOptionsSchema = z.object({
    name: z.string(),
    directory: z.string(),
    build: z
        .object({
            ports: z.record(z.string(), z.string()).default({}),
        })
        .default({}),
});

const validateInput = <T extends z.ZodTypeAny, U>(
    schema: T,
    fn: (arg: z.infer<T>) => U
) => {
    return (arg: z.infer<T>) => fn(schema.parse(arg));
};

const getOrCreateProject = async (name: string) => {
    const project = await getProject(name);

    return project !== undefined ? project : await createProject(name);
};

const createBuildRequest = async (projectId: number) => {
    return httpApi.mutation("createBuildRequest", projectId);
};

const deploy = async ({
    projectId,
    buildId,
    directory,
    ports,
}: Omit<DeployOptions, "logger"> & { buildId: string }) => {
    await uploadDir(directory, buildId);
    await build({ projectId, buildId, ports });
    await stopService(projectId, buildId);
    await startService({ projectId, buildId });
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
    const buildId = await createBuildRequest(projectId);

    relayLogs(buildId, logger);
    deploy({ projectId, buildId, directory, ports });

    return buildId;
};

export const deployProject = validateInput(
    ProjectOptionsSchema,
    async ({ name, directory, build: { ports } }) => {
        const project = await getOrCreateProject(name);
        const logger = new DeploymentLogger();

        const buildId = await startDeployment({
            projectId: project.id,
            directory,
            ports,
            logger,
        });

        return { project, build: { id: buildId, logger } };
    }
);
