import { z } from "zod";
import {
	deleteAccount as dbDeleteAccount,
	userExistsByUsername,
} from "../../../models/account";
import { procedure } from "../../../server/trpc";

export const deleteAccount = procedure
	.input(
		z
			.string()
			.refine(
				(username) => userExistsByUsername({ username }),
				"A user with that username does not exist."
			)
	)
	.mutation(({ input: username }) => dbDeleteAccount(username));
