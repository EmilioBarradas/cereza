import { z } from "zod";
import { httpApi } from "../trpc";
import { wrapTRPC } from "../trpc/error";

export const ServerCerezaConfigSchema = z.object({
	server: z.string(),
});

export type ServerCerezaConfig = z.infer<typeof ServerCerezaConfigSchema>;

export class CerezaServer {
	constructor(private readonly config: ServerCerezaConfig) {
		ServerCerezaConfigSchema.parse(this.config);
	}

	public async getProjects() {
		return wrapTRPC(httpApi.getProjects.query());
	}
}
