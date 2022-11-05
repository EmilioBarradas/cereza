import { z } from "zod";
import { getProjectById } from "../../../models/project/get";
import { procedure } from "../../../server/trpc";

export const getProcessStatus = procedure
	.input(z.string().refine(getProjectById, "Project not found."))
	.query(async ({ input: projectId }) => {
		const project = await getProjectById(projectId);

		// This check is unnecessary.
		if (project === null) return;

		return project.status;
	});
