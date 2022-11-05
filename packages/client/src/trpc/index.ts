import {
	createTRPCProxyClient,
	createWSClient,
	httpLink,
	wsLink,
} from "@trpc/client";
import type { ApiRouter } from "api/src";
import IsoWebSocket from "isomorphic-ws";
import { Agent, fetch as timeoutFetch, setGlobalDispatcher } from "undici";

setGlobalDispatcher(new Agent({ bodyTimeout: 300000 }));

export const httpApi = createTRPCProxyClient<ApiRouter>({
	links: [
		httpLink({
			url: "http://localhost:59213/api",
			fetch: (input, init) =>
				(timeoutFetch as any as typeof fetch)(input, init),
		}),
	],
});

export const connectToWsApi = () => {
	const client = createWSClient({
		url: `ws://localhost:59213/`,
		WebSocket: IsoWebSocket as any,
	});

	return {
		socket: client,
		wsApi: createTRPCProxyClient<ApiRouter>({
			links: [wsLink({ client })],
		}),
	};
};
