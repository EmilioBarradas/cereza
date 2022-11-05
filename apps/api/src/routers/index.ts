import { mergeRouters } from "../server/trpc";
import { getAccountRouter } from "./account";
import { getBuildRouter } from "./build";
import { getProjectRouter } from "./project";
import { getRuntimeRouter } from "./runtime";

export const apiRouter = mergeRouters(
	getProjectRouter(),
	getBuildRouter(),
	getRuntimeRouter(),
	getAccountRouter()
);

export type ApiRouter = typeof apiRouter;
