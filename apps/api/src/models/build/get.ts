import { prisma } from "../../clients/prisma";

export const getBuild = (buildId: string) => {
	return prisma.build.findFirst({ where: { id: buildId } });
};

export const getBuilds = (projectId: string) => {
	return prisma.build.findMany({
		where: {
			projectId,
		},
	});
};

export const getLatestBuild = (projectId: string) => {
	return prisma.build.findFirst({
		where: {
			projectId,
		},
		orderBy: {
			createdAt: "desc",
		},
	});
};
