import { CompleteCerezaConfig, CompleteCerezaConfigSchema } from "./cereza.js";
import { httpApi, wrapTRPC } from "./trpc.js";

export class CerezaProcess {
	constructor(private readonly config: CompleteCerezaConfig) {
		CompleteCerezaConfigSchema.parse(this.config);
	}

	public async getStatus() {
		return wrapTRPC(httpApi.query("getProcessStatus", this.config.id));
	}

	public async isRunning() {
		const status = await this.getStatus();

		return status?.value === "Online";
	}

	public async start() {
		await wrapTRPC(
			httpApi.mutation("startProcess", {
				projectId: this.config.id,
				logToBuild: false,
			})
		);
	}

	public async stop() {
		await wrapTRPC(
			httpApi.mutation("stopProcess", { projectId: this.config.id })
		);
	}
}
