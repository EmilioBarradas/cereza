import { CerezaUserAccount } from "./normal";
import { httpApi } from "../trpc";
import { wrapTRPC } from "../trpc/error";
import { z } from "zod";
import { UserAccountConfigSchema } from "./schema";

export const UserAccountCredentialsConfigSchema = z.intersection(
	UserAccountConfigSchema,
	z.object({
		password: z.string().min(1, "Password must not be empty."),
	})
);

export type UserAccountCredentialsConfig = z.infer<
	typeof UserAccountCredentialsConfigSchema
>;

export class CerezaUserAuthAccount extends CerezaUserAccount {
	constructor(private readonly authConfig: UserAccountCredentialsConfig) {
		super(authConfig);

		UserAccountCredentialsConfigSchema.parse(this.authConfig);
	}

	public create() {
		return wrapTRPC(httpApi.createAccount.mutate(this.authConfig));
	}

	public login() {
		return wrapTRPC(httpApi.login.mutate(this.authConfig));
	}
}
