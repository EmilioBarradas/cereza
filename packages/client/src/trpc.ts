import { createTRPCClient } from "@trpc/client";
import { createWSClient, wsLink } from "@trpc/client/links/wsLink/";
import type { ApiRouter } from "api/src";
import IsoWebSocket from "isomorphic-ws";

export const httpApi = createTRPCClient<ApiRouter>({
    url: "http://localhost:59213/api",
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
