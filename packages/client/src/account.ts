import {
	UserAccountConfig,
	UserAccountConfigSchema,
	UserAccountCredentialsConfigSchema,
} from "./cereza";
import { httpApi, wrapTRPC } from "./trpc";

export class CerezaUserAccount {
	constructor(private readonly config: UserAccountConfig) {
		UserAccountConfigSchema.parse(this.config);
	}

	public exists() {
		return wrapTRPC(httpApi.query("accountExists", this.config.username));
	}

	public delete() {
		return wrapTRPC(
			httpApi.mutation("deleteAccount", this.config.username)
		);
	}
}
