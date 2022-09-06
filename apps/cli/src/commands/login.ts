import { Command } from "@oclif/core";
import { CerezaUserAccount } from "client/src";
import { readFile, writeFile } from "fs/promises";
import inquirer from "inquirer";
import { resolve } from "path";
import { updateToken } from "../config";

const prompt = () => {
	return inquirer.prompt<{
		server: string;
		username: string;
		password: string;
		confirmedPassword: string;
	}>([
		{
			name: "server",
			message: "What server would you like to log in to?",
			default: "cereza.dev",
		},
		{
			name: "username",
			message: "What's your username?",
			validate: (username: string) =>
				username.length > 0 ? true : "Username must not be empty.",
		},
		{
			type: "password",
			mask: "*",
			name: "password",
			message: "What's your password?",
			validate: (password: string) =>
				password.length > 0 ? true : "Password must not be empty.",
		},
	]);
};

export default class Login extends Command {
	static description = "Log into an account.";

	async run() {
		const { server, username, password } = await prompt();

		const account = new CerezaUserAccount({ username, password });
		const token = await account.login();

		await updateToken(server, token);

		this.log("Logged in.");
	}
}
