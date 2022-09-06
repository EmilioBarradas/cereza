import { LogEntry } from "api/src/logs";
import EventEmitter from "events";

export default class LogTextTransformer extends EventEmitter {
	transform(log: LogEntry) {
		this.emit("data", {
			...log,
			text: this.getText(log),
		});
	}

	getText(entry: LogEntry): string {
		if ("stream" in entry.data) {
			return entry.data.stream;
		} else if ("status" in entry.data) {
			return "progress" in entry.data
				? `${entry.data.status} ${entry.data.progress}\n`
				: `${entry.data.status}\n`;
		}
		throw new Error(`Received unknown log entry with type: ${entry.type}.`);
	}
}
