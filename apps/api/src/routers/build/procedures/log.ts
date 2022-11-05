import { observable } from "@trpc/server/observable";
import { z } from "zod";
import { DeploymentLoggers, LogEntry } from "../../../logs";
import { getBuild } from "../../../models/build/get";
import { procedure } from "../../../server/trpc";

export const onBuildLog = procedure
	.input(z.string().refine(getBuild, "Build request not found."))
	.subscription(({ input: buildId }) => {
		return observable<LogEntry>((emitter) => {
			DeploymentLoggers.of(buildId).then(async (logger) => {
				for await (const log of logger) {
					emitter.next(log);
				}

				emitter.complete();
			});

			return () => {};
		});
	});
