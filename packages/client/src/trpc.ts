import { createTRPCClient, TRPCClientError } from "@trpc/client";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink";
import type { ApiRouter } from "api/src";
import IsoWebSocket from "isomorphic-ws";
import { Agent, fetch as timeoutFetch, setGlobalDispatcher } from "undici";

setGlobalDispatcher(
	new Agent({
		bodyTimeout: 300000,
	})
);

export const httpApi = createTRPCClient<ApiRouter>({
	url: "http://localhost:59213/api",
	fetch: async (input, init) => {
		const unsafeFetch = timeoutFetch as any as typeof fetch;

		return unsafeFetch(input, init);
	},
});

export const connectToWsApi = () => {
	const client = createWSClient({
		url: `ws://localhost:59213/`,
		WebSocket: IsoWebSocket as any,
	});

	return {
		socket: client,
		wsApi: createTRPCClient<ApiRouter>({
			links: [wsLink({ client })],
		}),
	};
};

const wrapError = async <T>(
	callable: Promise<T> | (() => T | Promise<T>)
): Promise<{ success: true; data: T } | { success: false; error: unknown }> => {
	try {
		const normal = typeof callable === "function" ? callable() : callable;
		return { success: true, data: await normal };
	} catch (error) {
		return { success: false, error };
	}
};

export const wrapTRPC = async <T>(data: Promise<T>) => {
	const result = await wrapError(data);

	return result.success ? result.data : await throwError(result.error);
};

const throwError = async (error: unknown) => {
	if (!(error instanceof TRPCClientError)) throw error;

	const newResult = await wrapError(() => JSON.parse(error.message));

	throw new Error(
		newResult.success
			? newResult.data[0]?.message ?? error.shape.message
			: error.shape.message
	);
};
