import EventEmitter from "events";

export default class LogGrouper extends EventEmitter {
	private readonly logs = new Map<string, TextLogEntry[]>();

	add(entry: TextLogEntry) {
		const id = entry.id;
		const idLogs = this.logs.get(id) ?? [];

		this.logs.set(id, idLogs);

		idLogs.push(entry);

		this.emit(
			"data",
			[...this.logs.entries()].map(([id, logs]) => ({ id, logs }))
		);
	}
}
