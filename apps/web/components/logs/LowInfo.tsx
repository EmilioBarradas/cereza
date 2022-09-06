import { Divider, useMantineTheme } from "@mantine/core";
import { FunctionComponent } from "react";
import { LogLine } from "./LogLine";
import { LogTimestamp } from "./LogTimestamp";

const EntryDateFormatter = new Intl.DateTimeFormat("en-US", {
	timeStyle: "medium",
	hour12: false,
});

export const LogInfo: FunctionComponent<{
	timestamp?: number;
	line?: number;
	showTimestamp?: boolean;
	useTimestampTooltip?: boolean;
	showLine?: boolean;
}> = ({
	timestamp = 0,
	line = 0,
	showTimestamp = true,
	useTimestampTooltip = true,
	showLine = true,
}) => {
	const theme = useMantineTheme();

	return (
		<>
			<LogTimestamp
				time={EntryDateFormatter.format(timestamp)}
				showTimestamp={showTimestamp}
				useTooltip={useTimestampTooltip}
			/>

			<Divider
				size="sm"
				color={theme.colors.dark[3]}
				orientation="vertical"
			/>

			<LogLine line={line} showLine={showLine} />
		</>
	);
};
