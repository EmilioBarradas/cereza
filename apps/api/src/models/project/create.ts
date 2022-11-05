import { prisma } from "../../clients/prisma";

export const createProject = (name: string, userId: string) => {
	return prisma.project.create({
		data: {
			name,
			owner: {
				connect: {
					id: userId,
				},
			},
			status: {
				create: {},
			},
		},
	});
};
