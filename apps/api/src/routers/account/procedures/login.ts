import { getAccountByCreds, userExistsByCreds } from "../../../models/account";
import { procedure } from "../../../server/trpc";
import { generateUserToken } from "../../../utils/token";
import { CredentialsSchema } from "../schemas/credentials";

export const login = procedure
	.input(
		CredentialsSchema.refine(
			userExistsByCreds,
			"A user with those credentials does not exist."
		)
	)
	.mutation(async ({ input: credentials }) => {
		const account = await getAccountByCreds(credentials);

		if (account === null) return "ERROR";

		return generateUserToken({
			userId: account.id,
			username: account.username,
		});
	});
