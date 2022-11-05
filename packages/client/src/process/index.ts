import { z } from "zod";
import { CompleteCerezaConfigSchema } from "../project";
import { httpApi } from "../trpc";
import { wrapTRPC } from "../trpc/error";

export type CompleteCerezaConfig = z.infer<typeof CompleteCerezaConfigSchema>;

export class CerezaProcess {
	constructor(private readonly config: CompleteCerezaConfig) {
		CompleteCerezaConfigSchema.parse(this.config);
	}

	public async getStatus() {
		return wrapTRPC(httpApi.getProcessStatus.query(this.config.id));
	}

	public async isRunning() {
		const status = await this.getStatus();

		return status?.value === "Online";
	}

	public async start() {
		await wrapTRPC(
			httpApi.startProcess.mutate({
				projectId: this.config.id,
				logToBuild: false,
			})
		);
	}

	public async stop() {
		await wrapTRPC(
			httpApi.stopProcess.mutate({ projectId: this.config.id })
		);
	}
}
