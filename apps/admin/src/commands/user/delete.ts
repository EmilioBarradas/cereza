import { Command } from "@oclif/core";

export default class DeleteUser extends Command {
    static description = "Delete an existing user.";

	async run() {
		this.log("Delete user.");
	}
}
