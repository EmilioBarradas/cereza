import { createServer } from "http";
import { expressApp } from "./express";

export const httpServer = createServer(expressApp);

httpServer.listen(59213, () => console.log("Started server on port 59213."));
