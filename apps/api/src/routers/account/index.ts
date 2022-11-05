import { router } from "../../server/trpc";
import {
	accountExists,
	createAccount,
	deleteAccount,
	login,
} from "./procedures";

export const getAccountRouter = () => {
	return router({ accountExists, createAccount, deleteAccount, login });
};
