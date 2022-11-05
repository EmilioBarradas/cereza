import { hash } from "bcrypt";
import { prisma } from "../../clients/prisma";
import type { UserAccountCredentials } from "./types";

export const createAccount = async ({
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
