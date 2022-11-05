import PersistedReadableStream from "../stream";
import type { LogEntry } from "../types";

export class MemoryDeploymentLogger extends PersistedReadableStream<LogEntry> {
	constructor(logger?: MemoryDeploymentLogger) {
		super(logger);
	}

	public entry({ type, data, timestamp }: LogEntry) {
		this.data(type, data, timestamp);
	}

	public data(type: string, data = {}, timestamp = Date.now()) {
		this.enqueue({ timestamp, type, data });
	}

	public end() {
		this.close();
	}
}
