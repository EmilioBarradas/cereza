import { Box, Text } from "@mantine/core";
import { FunctionComponent } from "react";

export const LogLine: FunctionComponent<{
	line: number;
	showLine?: boolean;
}> = ({ line, showLine = true }) => {
	if (!showLine) {
		return <Box sx={{ width: "50px" }} />;
	}

	return (
		<Text size="sm" color="dimmed" style={{ minWidth: "50px" }}>
			{line + 1}
		</Text>
	);
};
