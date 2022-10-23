import { Command } from "@oclif/core";
import { CerezaUserAccount, CerezaUserAuthAccount } from "client";
import inquirer from "inquirer";

const prompt = () => {
	return inquirer.prompt<{ password: string }>([
		{
			name: "password",
			type: "password",
			mask: "*",
			message: "Password",
		},
	]);
};

export default class CreateUser extends Command {
	static description = "Create a new user.";
	static args = [{ name: "username", required: true }];

	async run() {
		const {
			args: { username },
		} = await this.parse(CreateUser);

		const account = new CerezaUserAccount({ username });

		if (await account.exists()) {
			this.error("An account with that username already exists.");
		}

		const { password } = await prompt();

		const authAccount = new CerezaUserAuthAccount({ username, password });

		await authAccount.create();

		this.log("Created user.");
	}
}
