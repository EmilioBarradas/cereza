import { ServerCerezaConfig, ServerCerezaConfigSchema } from "./cereza.js";
import { httpApi, wrapTRPC } from "./trpc.js";

export class CerezaServer {
	constructor(private readonly config: ServerCerezaConfig) {
		ServerCerezaConfigSchema.parse(this.config);
	}

	public async getProjects() {
		return wrapTRPC(httpApi.query("getProjects"));
	}
}
