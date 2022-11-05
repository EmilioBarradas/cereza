import { z } from "zod";
import { httpApi } from "../trpc";
import { wrapTRPC } from "../trpc/error";

export const InitCerezaConfigSchema = z.object({
	server: z.string(),
	name: z.string(),
});

export const CompleteCerezaConfigSchema = z.intersection(
	InitCerezaConfigSchema,
	z.object({ id: z.string() })
);

export const CreateCerezaConfigSchema = z.intersection(
	InitCerezaConfigSchema,
	z.object({ name: z.string(), userId: z.string() })
);

export type CreateCerezaConfigSchema = z.infer<typeof CreateCerezaConfigSchema>;
export type InitCerezaConfig = z.infer<typeof InitCerezaConfigSchema>;

export class CerezaProject {
	constructor(
		private readonly config: InitCerezaConfig | CreateCerezaConfigSchema
	) {
		InitCerezaConfigSchema.parse(this.config);
	}

	public async exists() {
		const project = await wrapTRPC(
			httpApi.getProject.query(this.config.name)
		);

		return project !== null;
	}

	public async create() {
		const { userId, name } = CreateCerezaConfigSchema.parse(this.config);

		return wrapTRPC(
			httpApi.createProject.mutate({
				name,
				userId,
			})
		);
	}
}
