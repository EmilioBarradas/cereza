import { LogEntry } from "api/src/logs";
import EventEmitter from "events";

export default class LogFilter extends EventEmitter {
	filter(log: LogEntry) {
		if (!this.isPrintable(log)) return;

		this.emit("data", log);
	}

	isPrintable(entry: LogEntry) {
		return "stream" in entry.data || "status" in entry.data;
	}
}
