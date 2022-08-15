import { router } from "@trpc/server";
import z from "zod";
import { prisma } from "database/src";

export const projectRouter = router()
    .query("getProjects", {
        resolve: async () => {
            return prisma.project.findMany();
        },
    })
    .query("getProject", {
        input: z.string(),
        resolve: async ({ input }) => {
            const project = await prisma.project.findFirst({
                where: {
                    name: input,
                },
            });

            if (project === null) return;

            return { id: project.id, name: project.name };
        },
    })
    .mutation("createProject", {
        input: z
            .string()
            .min(3, "Project name must be atleast 3 characters long.")
            .max(32, "Project name must not exceed 32 characters."),
        resolve: async ({ input }) => {
            const project = await prisma.project.create({
                data: {
                    name: input,
                },
            });

            return { id: project.id };
        },
    });
