import { router } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express/dist/trpc-server-adapters-express.cjs";
import { applyWSSHandler } from "@trpc/server/adapters/ws/dist/trpc-server-adapters-ws.cjs";
import cors from "cors";
import type { Express } from "express";
import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { buildRouter } from "./build";
import { projectRouter } from "./project";
import { runtimeRouter } from "./runtime";
import { mergeStorage } from "./storage";

const mergeRouters = (app: Express) => {
    app.use(
        "/api",
        createExpressMiddleware({
            router: apiRouter,
        })
    );
};

const apiRouter = router()
    .merge(projectRouter)
    .merge(buildRouter)
    .merge(runtimeRouter);

const expressApp = express();
const httpServer = createServer(expressApp);
const wsServer = new WebSocketServer({ server: httpServer });
const wsHandler = applyWSSHandler({
    wss: wsServer,
    router: apiRouter,
});

expressApp.use(cors());

mergeStorage(expressApp);
mergeRouters(expressApp);

httpServer.listen(59213);

process.on("SIGTERM", () => {
    wsHandler.broadcastReconnectNotification();
    wsServer.close();
    httpServer.close();
});

export type ApiRouter = typeof apiRouter;
