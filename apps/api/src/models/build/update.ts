import { prisma } from "../../clients/prisma";

export const updatePortMapping = async (
	buildId: string,
	mapping: {
		internal: string;
		external: number;
	}[]
) => {
	return prisma.build.update({
		where: {
			id: buildId,
		},
		data: {
			ports: {
				create: mapping,
			},
		},
	});
};

export const updateBuildStatus = (buildId: string, finished: boolean) => {
	return prisma.build.update({
		where: {
			id: buildId,
		},
		data: {
			finished: true,
		},
	});
};
