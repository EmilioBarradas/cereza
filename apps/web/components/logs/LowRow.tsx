import { Group, Text } from "@mantine/core";
import { CSSProperties, FunctionComponent } from "react";
import { LogInfo } from "./LowInfo";

export const LogRow: FunctionComponent<{
	style: CSSProperties;
	timestamp: number;
	showTimestamp: boolean;
	line: number;
	text: string;
}> = ({ style, timestamp, line, showTimestamp, text }) => {
	return (
		<Group noWrap align="stretch" style={style}>
			<LogInfo
				timestamp={timestamp}
				line={line}
				showTimestamp={showTimestamp}
			/>

			<Text color="white" style={{ flexGrow: 1, whiteSpace: "nowrap" }}>
				{text}
			</Text>
		</Group>
	);
};
