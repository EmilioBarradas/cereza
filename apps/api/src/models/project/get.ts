import { prisma } from "../../clients/prisma";

export const getProjects = () => {
	return prisma.project.findMany({
		include: {
			owner: true,
			status: true,
		},
	});
};

export const getProjectById = async (projectId: string) => {
	return prisma.project.findFirst({
		where: {
			id: projectId,
		},
		include: {
			status: true,
		},
	});
};

export const getProjectByName = (projectName: string) => {
	return prisma.project.findFirst({
		where: {
			name: projectName,
		},
		include: {
			owner: true,
		},
	});
};

export const projectWithIdExists = async (name: string) => {
	return (await getProjectById(name)) !== null;
};

export const projectWithNameExists = async (name: string) => {
	return (await getProjectByName(name)) !== null;
};
