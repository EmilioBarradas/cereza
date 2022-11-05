import { compare } from "bcrypt";
import { prisma } from "../../clients/prisma";
import type { UserAccount, UserAccountCredentials } from "./types";

export const getAccountByUsername = ({ username }: UserAccount) => {
	return prisma.userAccount.findFirst({
		where: {
			username,
		},
	});
};

export const getAccountByCreds = async ({
	username,
	password,
}: UserAccountCredentials) => {
	const account = await getAccountByUsername({ username });
	if (account === null) return null;

	const isValid = await compare(password, account.password);
	if (!isValid) return null;

	return account;
};

export const userExistsByUsername = async ({ username }: UserAccount) => {
	return (await getAccountByUsername({ username })) !== null;
};

export const userExistsByCreds = async (
	credentials: UserAccountCredentials
) => {
	return (await getAccountByCreds(credentials)) !== null;
};
