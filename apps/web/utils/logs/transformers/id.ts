import { LogEntry } from "api/src/logs";
import EventEmitter from "events";
import { nanoid } from "nanoid";

export default class LogIdTransformer extends EventEmitter {
	transform(log: LogEntry) {
		this.emit("data", {
			...log,
			id: log.data.id ?? nanoid(),
		});
	}
}
