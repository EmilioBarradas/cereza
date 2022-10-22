import { ServerCerezaConfig, ServerCerezaConfigSchema } from "./cereza";
import { httpApi, wrapTRPC } from "./trpc";

export class CerezaServer {
	constructor(private readonly config: ServerCerezaConfig) {
		ServerCerezaConfigSchema.parse(this.config);
	}

	public async getProjects() {
		return wrapTRPC(httpApi.query("getProjects"));
	}
}
