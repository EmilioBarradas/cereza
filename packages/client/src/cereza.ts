import { z } from "zod";

export const ServerCerezaConfigSchema = z.object({
	server: z.string(),
});

export const InitCerezaConfigSchema = z.intersection(
	ServerCerezaConfigSchema,
	z.object({ name: z.string() })
);

export const CreateCerezaConfigSchema = z.intersection(
	InitCerezaConfigSchema,
	z.object({ name: z.string(), userId: z.string() })
);

export const CompleteCerezaConfigSchema = z.intersection(
	InitCerezaConfigSchema,
	z.object({ id: z.string() })
);

export const UserAccountConfigSchema = z.object({
	username: z.string().min(1, "Username must not be empty."),
});

export const UserAccountCredentialsConfigSchema = z.intersection(
	UserAccountConfigSchema,
	z.object({
		password: z.string().min(1, "Password must not be empty."),
	})
);

export type ServerCerezaConfig = z.infer<typeof ServerCerezaConfigSchema>;
export type InitCerezaConfig = z.infer<typeof InitCerezaConfigSchema>;
export type CreateCerezaConfigSchema = z.infer<typeof CreateCerezaConfigSchema>;
export type CompleteCerezaConfig = z.infer<typeof CompleteCerezaConfigSchema>;
export type UserAccountConfig = z.infer<typeof UserAccountConfigSchema>;
export type UserAccountCredentialsConfig = z.infer<
	typeof UserAccountCredentialsConfigSchema
>;
