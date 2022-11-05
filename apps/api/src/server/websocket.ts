import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";
import { apiRouter } from "../routers";
import { httpServer } from "./http";

export const wsServer = new WebSocketServer({ server: httpServer });
export const wsHandler = applyWSSHandler({
	wss: wsServer,
	router: apiRouter,
});
