import { TRPCClientError } from "@trpc/client";
import { wrapError } from "../utils/error";

const throwError = async (error: unknown) => {
	if (!(error instanceof TRPCClientError)) throw error;

	console.log(error);

	const newResult = await wrapError(() => JSON.parse(error.message));

	throw new Error(
		newResult.success
			? newResult.data[0]?.message ?? error.shape.message
			: error.shape.message
	);
};

export const wrapTRPC = async <T>(data: Promise<T>) => {
	const result = await wrapError(data);

	return result.success ? result.data : await throwError(result.error);
};
