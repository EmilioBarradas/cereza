import { router } from "@trpc/server";
import z from "zod";
import { prisma } from "database/src";
import { negate } from "../utils";

const getProject = (name: string) => {
	return prisma.project.findFirst({
		where: {
			name,
		},
	});
};

const projectExists = async (name: string) => {
	const project = await getProject(name);

	return project !== null;
};

export const projectRouter = router()
	.query("getProjects", {
		resolve: async () => {
			return prisma.project.findMany({
				include: {
					owner: true,
				},
			});
		},
	})
	.query("getProject", {
		input: z.string(),
		resolve: async ({ input }) => {
			return prisma.project.findFirst({
				where: {
					name: input,
				},
				include: {
					owner: true,
				},
			});
		},
	})
	.mutation("createProject", {
		input: z.object({
			name: z
				.string()
				.min(3, "Project name must be atleast 3 characters long.")
				.max(32, "Project name must not exceed 32 characters.")
				.refine(
					negate(projectExists),
					"A project with that name already exists."
				),
			userId: z.string(),
		}),
		resolve: async ({ input: { name, userId } }) => {
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
		},
	});
