import { Command } from "@oclif/core";
import { CerezaUserAccount } from "client/src/index";
import inquirer from "inquirer";

const prompt = () => {
	console.log(inquirer);

	return inquirer.prompt<{ password: string }>([
		{
			name: "password",
			type: "password",
			mask: "*",
			message: "Password",
		},
	]);
};

export default class AddUser extends Command {
	static description = "Add a new user.";
	static args = [{ name: "username", required: true }];

	async run() {
		const {
			args: { username },
		} = await this.parse(AddUser);

		const account = new CerezaUserAccount({ username });

		if (await account.exists()) {
			this.error("An account with that username already exists.");
		}

		const { password } = await prompt();

		const accountCreds = new CerezaUserAccount({ username, password });

		await accountCreds.create();

		this.log("Created user.");
	}
}
