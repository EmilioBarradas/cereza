import { createTRPCProxyClient } from "@trpc/client";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { ApiRouter } from "api";

export const trpc = createTRPCReact<ApiRouter>();
export const trpcClient = createTRPCProxyClient<ApiRouter>({
	links: [
		httpBatchLink({
			url: "http://localhost:59213/api",
		}),
	],
});
