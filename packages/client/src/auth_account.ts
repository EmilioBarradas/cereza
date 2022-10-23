import { CerezaUserAccount } from "./account";
import {
	UserAccountCredentialsConfig,
	UserAccountCredentialsConfigSchema,
} from "./cereza";
import { httpApi, wrapTRPC } from "./trpc";

export class CerezaUserAuthAccount extends CerezaUserAccount {
	constructor(private readonly authConfig: UserAccountCredentialsConfig) {
		super(authConfig);

		UserAccountCredentialsConfigSchema.parse(this.authConfig);
	}

	public create() {
		return wrapTRPC(httpApi.mutation("createAccount", this.authConfig));
	}

	public login() {
		return wrapTRPC(httpApi.mutation("login", this.authConfig));
	}
}
