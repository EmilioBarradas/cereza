import EventEmitter from "events";

export default class LogBuffer extends EventEmitter {
	private buffer = "";
	private log!: TextLogEntry;

	push(entry: TextLogEntry) {
		const partQueue = entry.text.split(/(?<=\n)/g);

		while (partQueue.length > 0) {
			const part = partQueue.shift();

			if (this.buffer.length === 0) {
				this.log = entry;
			}

			this.buffer += part;

			if (this.buffer.at(-1) !== "\n") continue;

			this.emit("data", {
				...this.log,
				text: this.buffer.slice(0, -1),
			});

			this.buffer = "";
		}
	}
}
