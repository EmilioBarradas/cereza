import { createExpressMiddleware } from "@trpc/server/adapters/express";
import type { Express } from "express";
import { mergeStorage } from "../handlers/storage";
import { apiRouter } from "../routers";
import { expressApp } from "./express";
import { httpServer } from "./http";
import { wsHandler, wsServer } from "./websocket";

const mergeRouters = (app: Express) => {
	app.use(
		"/api",
		createExpressMiddleware({
			router: apiRouter,
		})
	);
};

export const startServer = () => {
	mergeStorage(expressApp);
	mergeRouters(expressApp);

	process.on("SIGTERM", () => {
		wsHandler.broadcastReconnectNotification();
		wsServer.close();
		httpServer.close();
	});
};
