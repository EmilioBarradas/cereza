import EventEmitter from "events";

export default class LogTimestampTransformer extends EventEmitter {
	transform(groups: { id: string; logs: TextLogEntry[] }[]) {
		let prevEntry: TextLogEntry | undefined;

		const transformedLogs = groups.map((group) => {
			return {
				id: group.id,
				logs: group.logs.map<ProcessedTextLogEntry>((curEntry) => {
					const prevSecond = Math.floor(
						(prevEntry?.timestamp ?? NaN) / 1000
					);
					const curSecond = Math.floor(curEntry.timestamp / 1000);

					prevEntry = curEntry;

					return {
						...curEntry,
						showTimestamp: prevSecond !== curSecond,
					};
				}),
			};
		});

		this.emit("data", transformedLogs);
	}
}
