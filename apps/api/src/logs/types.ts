import type { MemoryDeploymentLogger } from "./loggers/memory";

export interface LogEntry {
	timestamp: number;
	type: string;
	data: any;
}

export interface FileDeploymentLoggerOptions {
	buildId: string;
	file?: string;
	memory?: MemoryDeploymentLogger;
}
