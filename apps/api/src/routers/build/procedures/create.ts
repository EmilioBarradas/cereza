import { z } from "zod";
import { DeploymentLoggers } from "../../../logs";
import { createBuild as dbCreateBuild } from "../../../models/build/create";
import { projectWithIdExists } from "../../../models/project/get";
import { procedure } from "../../../server/trpc";

export const createBuild = procedure
	.input(z.string().refine(projectWithIdExists, "Project not found."))
	.mutation(async ({ input: projectId }) => {
		const { id } = await dbCreateBuild(projectId);

		DeploymentLoggers.create(id);

		return id;
	});
