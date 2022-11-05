import {
	createAccount as dbCreateAccount,
	userExistsByUsername,
} from "../../../models/account";
import { procedure } from "../../../server/trpc";
import negate from "../../../utils/negate";
import { generateUserToken } from "../../../utils/token";
import { CredentialsSchema } from "../schemas/credentials";

export const createAccount = procedure
	.input(
		CredentialsSchema.refine(
			negate(userExistsByUsername),
			"An account with that username already exists."
		)
	)
	.mutation(async ({ input: credentials }) => {
		const { id, username } = await dbCreateAccount(credentials);

		return generateUserToken({ userId: id, username });
	});
