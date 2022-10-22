import {
	CreateCerezaConfigSchema,
	InitCerezaConfig,
	InitCerezaConfigSchema,
} from "./cereza";
import { httpApi, wrapTRPC } from "./trpc";

export class CerezaProject {
	constructor(
		private readonly config: InitCerezaConfig | CreateCerezaConfigSchema
	) {
		InitCerezaConfigSchema.parse(this.config);
	}

	public async exists() {
		const project = await wrapTRPC(
			httpApi.query("getProject", this.config.name)
		);

		return project !== null;
	}

	public async create() {
		const { userId, name } = CreateCerezaConfigSchema.parse(this.config);

		return wrapTRPC(
			httpApi.mutation("createProject", {
				name,
				userId,
			})
		);
	}
}
