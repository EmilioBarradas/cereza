import { z } from "zod";
import { getProjectById } from "../../../models/project/get";
import { procedure } from "../../../server/trpc";
import {
	getBuilds as dbGetBuilds,
	getBuild as dbGetBuild,
} from "../../../models/build/get";

export const getBuilds = procedure
	.input(z.string().refine(getProjectById, "Project not found."))
	.query(({ input: projectId }) => dbGetBuilds(projectId));

export const getBuild = procedure
	.input(z.string().refine(dbGetBuild, "Build request not found."))
	.query(({ input: buildId }) => dbGetBuild(buildId));
