import { router } from "@trpc/server";
import { compare, hash } from "bcrypt";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { exportPKCS8, generateKeyPair, importPKCS8, SignJWT } from "jose";
import z from "zod";
import { prisma } from "../prisma";
import { negate } from "../utils";

const KEY_DIR_PATH = "./keys/";
const PRIVATE_KEY_PATH = KEY_DIR_PATH + "private.key";

const readOrCreatePrivateKey = async () => {
	if (existsSync(PRIVATE_KEY_PATH)) {
		return importPKCS8(await readFile(PRIVATE_KEY_PATH, "utf-8"), "ES512");
	}

	if (!existsSync(KEY_DIR_PATH)) {
		await mkdir(KEY_DIR_PATH);
	}

	const { privateKey } = await generateKeyPair("ES512");

	writeFile(PRIVATE_KEY_PATH, await exportPKCS8(privateKey));

	console.log(`Generated private key at ${PRIVATE_KEY_PATH}.`);

	return privateKey;
};

const privateKey = readOrCreatePrivateKey();

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

const deleteAccount = async (username: string) => {
	return prisma.userAccount.delete({
		where: {
			username,
		},
	});
};

const CredentialsSchema = z.object({
	username: z.string(),
	password: z.string(),
});

const generateUserToken = async (details: {
	userId: string;
	username: string;
}) => {
	return new SignJWT(details)
		.setProtectedHeader({ alg: "RS256" })
		.sign(await privateKey);
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
	.mutation("deleteAccount", {
		input: z
			.string()
			.refine(
				(username) => userExistsUnsafe({ username }),
				"A user with that username does not exist."
			),
		resolve: ({ input: username }) => deleteAccount(username),
	})
	.mutation("login", {
		input: CredentialsSchema.refine(
			userExists,
			"A user with those credentials does not exist."
		),
		resolve: async ({ input: credentials }) => {
			const account = await getAccount(credentials);

			if (account === null) return "ERROR";

			return generateUserToken({
				userId: account.id,
				username: account.username,
			});
		},
	});
