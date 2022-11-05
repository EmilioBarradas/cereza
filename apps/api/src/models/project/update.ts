import { prisma } from "../../clients/prisma";

export const updateProjectStatus = (projectId: string, status: string) => {
	return prisma.project.update({
		where: {
			id: projectId,
		},
		data: {
			status: {
				update: {
					value: status,
				},
			},
		},
	});
};
