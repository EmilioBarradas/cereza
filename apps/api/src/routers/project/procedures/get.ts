import { procedure } from "../../../server/trpc";
import {
	getProjectByName,
	getProjects as dbGetProjects,
} from "../../../models/project/get";
import { z } from "zod";

export const getProjects = procedure.query(async () => dbGetProjects());

export const getProject = procedure
	.input(z.string())
	.query(async ({ input }) => getProjectByName(input));
