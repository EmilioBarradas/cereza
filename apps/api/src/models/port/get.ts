import { prisma } from "../../clients/prisma";

export const getPortMapping = (buildId: string) => {
	return prisma.portMapping.findMany({
		where: {
			buildId: {
				equals: buildId,
			},
		},
	});
};

export const findDuplicateMapping = (
	projectId: string,
	ports: number | number[]
) => {
	return prisma.portMapping.findFirst({
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
};
