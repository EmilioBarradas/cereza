import type { Express } from "express";
import bodyParser from "body-parser";
import { resolve } from "path";
import { writeFile, mkdir } from "fs/promises";
import { prisma } from "database";
import { DeploymentLoggers } from "../logs";

const STORAGE_DIR = "../../storage/uploads";

const storeData = async (data: Buffer, buildId: string) => {
	await mkdir(resolve(STORAGE_DIR, buildId));
	await writeFile(resolve(STORAGE_DIR, buildId, "data"), data);
};

export const mergeStorage = (app: Express) => {
	app.post(
		"/api/upload",
		async ({ headers: { "build-id": buildId } }, res, next) => {
			if (typeof buildId !== "string") return;

			const build = await prisma.build.findFirst({
				where: {
					id: buildId,
				},
			});

			if (build === null) {
				res.sendStatus(400);
				return;
			}

			next();
		}
	);

	app.post(
		"/api/upload",
		async ({ headers: { "build-id": buildId } }, _, next) => {
			if (typeof buildId !== "string") return;

			const logger = await DeploymentLoggers.of(buildId);

			logger.data("UPLOAD_START", { stream: "Upload started.\n" });

			next();
		}
	);

	app.use("/api/upload", bodyParser.raw({ limit: "1gb" }));

	app.post(
		"/api/upload",
		async ({ headers: { "build-id": buildId }, body }, res) => {
			if (typeof buildId !== "string") return;

			await storeData(body, buildId);

			const logger = await DeploymentLoggers.of(buildId);

			logger.data("UPLOAD_END", { stream: "Upload finished.\n" });

			res.json({ success: true, data: {} });
		}
	);
};
