import { Command } from "@oclif/core";
import { CerezaUserAccount } from "client";

export default class DeleteUser extends Command {
	static description = "Delete an existing user.";
	static args = [{ name: "username", required: true }];

	async run() {
		const {
			args: { username },
		} = await this.parse(DeleteUser);

		const account = new CerezaUserAccount({ username });

		if (!(await account.exists())) {
			this.error("An account with that username does not exist.");
		}

		account.delete();

		this.log("Created user.");
	}
}
