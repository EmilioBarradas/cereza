import { prisma } from "../../clients/prisma";

export const createBuild = (projectId: string) => {
	return prisma.build.create({
		data: {
			projectId,
		},
	});
};
