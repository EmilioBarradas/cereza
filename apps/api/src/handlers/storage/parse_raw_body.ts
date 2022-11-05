import bodyParser from "body-parser";

export const parseRawBody = bodyParser.raw({ limit: "1gb" });
