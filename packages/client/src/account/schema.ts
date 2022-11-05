import { z } from "zod";

export const UserAccountConfigSchema = z.object({
	username: z.string().min(1, "Username must not be empty."),
});

export type UserAccountConfig = z.infer<typeof UserAccountConfigSchema>;
