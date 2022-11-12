#!/usr/bin/env node
import { run, flush, Errors } from "@oclif/core";

run()
	.then(flush as any)
	.catch(Errors.handle);

export type { Config } from "./utils/config";
