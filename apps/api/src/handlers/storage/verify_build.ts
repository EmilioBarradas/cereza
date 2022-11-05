import { RequestHandler } from "express";
import { prisma } from "../../clients/prisma";

export const verifyBuild: RequestHandler = async (
	{ headers: { "build-id": buildId } },
	res,
	next
) => {
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
};
