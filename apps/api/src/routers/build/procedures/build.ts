import { resolve } from "path";
import { getPortPromise } from "portfinder";
import split from "split";
import { z } from "zod";
import { docker } from "../../../clients/docker";
import { getBuild } from "../../../models/build/get";
import { procedure } from "../../../server/trpc";
import { DeploymentLoggers } from "../../../logs";
import { findDuplicateMapping } from "../../../models/port/get";
import { updatePortMapping } from "../../../models/build/update";

const STORAGE_DIR = "../../storage/uploads";

const getUniqueOSPort = async (suggestedPort: number) => {
	return getPortPromise({ port: suggestedPort });
};

const verifyUniqueProjectPorts = async (
	projectId: string,
	ports: number | number[]
) => {
	return (await findDuplicateMapping(projectId, ports)) === null;
};

const getUniquePort = async (
	projectId: string,
	suggestedPort: number
): Promise<number> => {
	const osPort = await getUniqueOSPort(suggestedPort);
	const isAvailable = await verifyUniqueProjectPorts(projectId, osPort);

	return isAvailable ? osPort : getUniquePort(projectId, osPort + 1);
};

const toNum = (str: string) => Number(str.replace(/\D/g, ""));

const runBuild = async (buildId: string) => {
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

export const build = procedure
	.input(
		z
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
			)
	)
	.mutation(async ({ input: { projectId, buildId, ports } }) => {
		const _build = await getBuild(buildId);

		// This check is unnecessary.
		if (_build == null) return "";

		await runBuild(buildId);

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

		await updatePortMapping(_build.id, await Promise.all(portMappings));
	});
