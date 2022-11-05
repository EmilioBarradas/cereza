import cors from "cors";
import express from "express";

export const expressApp = express();

expressApp.use(cors());
