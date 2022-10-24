import { LogEntry } from "api/src/logs";

declare global {
	interface IdLogEntry extends LogEntry {
		id: string;
	}

	interface TextLogEntry extends IdLogEntry {
		text: string;
	}

	interface ProcessedTextLogEntry extends TextLogEntry {
		showTimestamp: boolean;
		timestamp: number;
	}

	type TreeNode = {
		id: string;
		alwaysVisible: boolean;
		height: number;
	} & (
		| {
				type: "DIVIDER";
				groupId: string;
				expanded: boolean;
				hiddenCount: number;
		  }
		| { type: "LOG"; log: ProcessedTextLogEntry; line: number }
	);

	interface LogGroup {
		id: string;
		logs: ProcessedTextLogEntry[];
	}
}
