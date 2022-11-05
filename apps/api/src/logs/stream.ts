import { EventEmitter } from "events";

export default class PersistedReadableStream<T> {
	private readonly emitter = new EventEmitter();
	private readonly history: T[] = [];
	private closed = false;

	constructor(stream?: PersistedReadableStream<T>) {
		if (stream === undefined) return;

		this.history = stream.history;
		this.closed = stream.closed;
	}

	protected enqueue(chunk: T) {
		this.history.push(chunk);
		this.emitter.emit("data", chunk);
	}

	protected close() {
		this.closed = true;
		this.emitter.emit("end");
	}

	public async *[Symbol.asyncIterator]() {
		const toSend = [...this.history];

		this.emitter.on("data", (chunk) => {
			toSend.push(chunk);
		});

		while (true) {
			try {
				while (toSend.length > 0) {
					yield toSend.shift()!;
				}

				if (this.closed) break;

				await new Promise((res, rej) => {
					this.emitter.once("data", res);
					this.emitter.once("end", rej);
				});
			} catch (err) {
				break;
			}
		}
	}
}
