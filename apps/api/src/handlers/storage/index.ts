import type { Express } from "express";
import { logBuildStart } from "./log_build_start";
import { parseRawBody } from "./parse_raw_body";
import { storeBody } from "./store_body";
import { verifyBuild } from "./verify_build";

export const mergeStorage = (app: Express) => {
	app.post("/api/upload", verifyBuild);
	app.post("/api/upload", logBuildStart);
	app.post("/api/upload", parseRawBody);
	app.post("/api/upload", storeBody);
};
