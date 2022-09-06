import { router } from "@trpc/server";
import z from "zod";
import { prisma } from "database/src";
import { hash, compare } from "bcrypt";
import { readFile } from "fs/promises";
import { SignJWT, importPKCS8 } from "jose";
import { negate } from "../utils";

const privateKey = await importPKCS8(
	await readFile("./private.key", "utf-8"),
	"RS256"
);

interface UserAccount {
	username: string;
}

interface UserAccountCredentials extends UserAccount {
	password: string;
}

const getAccountUnsafe = ({ username }: UserAccount) => {
	return prisma.userAccount.findFirst({
		where: {
			username,
		},
	});
};

const getAccount = async ({ username, password }: UserAccountCredentials) => {
	const account = await getAccountUnsafe({ username });

	if (account === null) return null;

	const isValid = await compare(password, account.password);

	return isValid ? account : null;
};

const userExistsUnsafe = async ({ username }: UserAccount) => {
	return (await getAccountUnsafe({ username })) !== null;
};

const userExists = async (credentials: UserAccountCredentials) => {
	return (await getAccount(credentials)) !== null;
};

const createAccount = async ({
	username,
	password,
}: UserAccountCredentials) => {
	return prisma.userAccount.create({
		data: {
			username,
			password: await hash(password, 10),
		},
	});
};

const CredentialsSchema = z.object({
	username: z.string(),
	password: z.string(),
});

const generateUserToken = (details: { userId: string; username: string }) => {
	return new SignJWT(details)
		.setProtectedHeader({ alg: "RS256" })
		.sign(privateKey);
};

export const accountRouter = router()
	.query("accountExists", {
		input: z.string(),
		resolve: ({ input: username }) => userExistsUnsafe({ username }),
	})
	.mutation("createAccount", {
		input: CredentialsSchema.refine(
			negate(userExistsUnsafe),
			"An account with that username already exists."
		),
		resolve: async ({ input: credentials }) => {
			const { id, username } = await createAccount(credentials);

			return generateUserToken({ userId: id, username });
		},
	})
	.mutation("login", {
		input: CredentialsSchema.refine(
			userExists,
			"A user with those credentials does not exist."
		),
		resolve: async ({ input: credentials }) => {
			const account = await getAccount(credentials);

			if (account === null) return;

			return generateUserToken({
				userId: account.id,
				username: account.username,
			});
		},
	});
