import { LogEntry } from "api/src/logs";

export default class DeploymentLogger {
	private controller!: ReadableStreamController<any>;
	private readonly stream = new ReadableStream({
		start: (controller) => {
			this.controller = controller;
		},
	});

	public data(type: string, data = {}, timestamp = Date.now()) {
		this.controller.enqueue({ timestamp, type, data });
	}

	public entry(entry: LogEntry) {
		this.data(entry.type, entry.data, entry.timestamp);
	}

	public end() {
		this.controller.close();
	}

	public async getReader() {
		return this.stream.getReader();
	}

	[Symbol.asyncIterator] = (this.stream as any)[Symbol.asyncIterator].bind(
		this.stream
	);
}
