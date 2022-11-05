import { router } from "../../server/trpc";
import { getProcessStatus, startProcess, stopProcess } from "./procedures";

export const getRuntimeRouter = () => {
	return router({ getProcessStatus, startProcess, stopProcess });
};
