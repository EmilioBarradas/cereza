import { RequestHandler } from "express";
import { DeploymentLoggers } from "../../logs";

export const logBuildStart: RequestHandler = async (
	{ headers: { "build-id": buildId } },
	_,
	next
) => {
	if (typeof buildId !== "string") return;

	const logger = await DeploymentLoggers.of(buildId);

	logger.data("UPLOAD_START", { stream: "Upload started.\n" });

	next();
};
