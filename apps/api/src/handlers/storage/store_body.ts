import { RequestHandler } from "express";
import { mkdir, writeFile } from "fs/promises";
import { resolve } from "path";
import { DeploymentLoggers } from "../../logs";

const STORAGE_DIR = "../../storage/uploads";

const storeData = async (data: Buffer, buildId: string) => {
	await mkdir(resolve(STORAGE_DIR, buildId));
	await writeFile(resolve(STORAGE_DIR, buildId, "data"), data);
};

export const storeBody: RequestHandler = async (
	{ headers: { "build-id": buildId }, body },
	res
) => {
	if (typeof buildId !== "string") return;

	await storeData(body, buildId);

	const logger = await DeploymentLoggers.of(buildId);

	logger.data("UPLOAD_END", { stream: "Upload finished.\n" });

	res.json({ success: true, data: {} });
};
