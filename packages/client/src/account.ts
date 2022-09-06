import {
	UserAccountConfig,
	UserAccountConfigSchema,
	UserAccountCredentialsConfig,
	UserAccountCredentialsConfigSchema,
} from "./cereza.js";
import { httpApi, wrapTRPC } from "./trpc.js";

export class CerezaUserAccount {
	constructor(
		private readonly config:
			| UserAccountConfig
			| UserAccountCredentialsConfig
	) {
		UserAccountConfigSchema.parse(this.config);
	}

	public exists() {
		return wrapTRPC(httpApi.query("accountExists", this.config.username));
	}

	public create() {
		const credentials = UserAccountCredentialsConfigSchema.parse(
			this.config
		);

		return wrapTRPC(httpApi.mutation("createAccount", credentials));
	}

	public login() {
		const credentials = UserAccountCredentialsConfigSchema.parse(
			this.config
		);

		return wrapTRPC(httpApi.mutation("login", credentials));
	}
}
