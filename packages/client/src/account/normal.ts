import { UserAccountConfig, UserAccountConfigSchema } from "./schema";
import { httpApi } from "../trpc";
import { wrapTRPC } from "../trpc/error";

export class CerezaUserAccount {
	constructor(private readonly config: UserAccountConfig) {
		UserAccountConfigSchema.parse(this.config);
	}

	public exists() {
		return wrapTRPC(httpApi.accountExists.query(this.config.username));
	}

	public delete() {
		return wrapTRPC(httpApi.deleteAccount.mutate(this.config.username));
	}
}
