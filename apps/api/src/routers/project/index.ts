import { router } from "../../server/trpc";
import { getProjects, getProject, createProject } from "./procedures";

export const getProjectRouter = () => {
	return router({ getProjects, getProject, createProject });
};
