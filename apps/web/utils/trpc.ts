import { createReactQueryHooks } from "@trpc/react";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink/";
import type { ApiRouter } from "api/src/index";
import WebSocket from "isomorphic-ws";

export const trpc = createReactQueryHooks<ApiRouter>();
export const trpcClient = trpc.createClient({
    links: [
        wsLink({
            client: createWSClient({
                url: `ws://localhost:59213/`,
                WebSocket: WebSocket as any,
            }),
        }),
    ],
});
