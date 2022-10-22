import { Command } from "@oclif/core";
import { CerezaUserAccount } from "client/src/index.js";
import inquirer from "inquirer";
import { updateToken } from "../config.js";

const prompt = () => {
	return inquirer.prompt<{
		server: string;
		username: string;
		password: string;
		confirmedPassword: string;
	}>([
		{
			name: "server",
			message: "What server would you like to create an account on?",
			default: "cereza.dev",
		},
		{
			name: "username",
			message: "What username would you like to use?",
			validate: async (username: string) => {
				const account = new CerezaUserAccount({ username });

				const isValidLength = username.length > 0;
				if (!isValidLength) return "Username must not be empty.";

				const isTaken = await account.exists();
				if (isTaken)
					return "An account with that username already exists.";

				return true;
			},
		},
		{
			type: "password",
			mask: "*",
			name: "password",
			message: "What password would you like to use?",
			validate: (password: string) =>
				password.length > 0 ? true : "Password must not be empty.",
		},
		{
			type: "password",
			mask: "*",
			name: "confirmedPassword",
			message: "Confirm your password.",
			validate: (confirmedPassword: string, answers) => {
				return confirmedPassword === answers?.password
					? true
					: "Passwords do not match.";
			},
		},
	]);
};

export default class Signup extends Command {
	static description = "Create a new account.";

	async run() {
		const { server, username, password } = await prompt();

		const account = new CerezaUserAccount({ username, password });
		const token = await account.create();

		await updateToken(server, token);

		this.log("Account created.");
	}
}
