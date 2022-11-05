import { z } from "zod";
import { createProject as dbCreateProject } from "../../../models/project/create";
import { projectWithNameExists } from "../../../models/project/get";
import { procedure } from "../../../server/trpc";
import negate from "../../../utils/negate";

export const createProject = procedure
	.input(
		z.object({
			name: z
				.string()
				.min(3, "Project name must be atleast 3 characters long.")
				.max(32, "Project name must not exceed 32 characters.")
				.refine(
					negate(projectWithNameExists),
					"A project with that name already exists."
				),
			userId: z.string(),
		})
	)
	.mutation(async ({ input: { name, userId } }) =>
		dbCreateProject(name, userId)
	);
