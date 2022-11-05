import { router } from "../../server/trpc";
import {
	build,
	createBuild,
	getBuild,
	getBuilds,
	onBuildLog,
} from "./procedures";

export const getBuildRouter = () => {
	return router({ getBuilds, getBuild, createBuild, build, onBuildLog });
};
