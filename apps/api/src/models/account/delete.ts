import { prisma } from "../../clients/prisma";

export const deleteAccount = async (username: string) => {
	return prisma.userAccount.delete({
		where: {
			username,
		},
	});
};
