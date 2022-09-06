import { Center, Divider, Text, Tooltip, useMantineTheme } from "@mantine/core";
import { FunctionComponent } from "react";

export const LogTimestamp: FunctionComponent<{
	time: string;
	showTimestamp?: boolean;
	useTooltip?: boolean;
}> = ({ time, showTimestamp = true, useTooltip = true }) => {
	const theme = useMantineTheme();

	if (!showTimestamp && useTooltip) {
		return (
			<Tooltip.Floating label={time}>
				<Center style={{ minWidth: "60px", alignItems: "stretch" }}>
					<Divider
						size="sm"
						color={theme.colors.dark[5]}
						orientation="vertical"
					/>
				</Center>
			</Tooltip.Floating>
		);
	} else if (!showTimestamp) {
		return (
			<Center style={{ minWidth: "60px", alignItems: "stretch" }}>
				<Divider
					size="sm"
					color={theme.colors.dark[5]}
					orientation="vertical"
				/>
			</Center>
		);
	}

	return (
		<Text
			size="sm"
			color="dimmed"
			style={{ position: "sticky", minWidth: "60px" }}
		>
			{time}
		</Text>
	);
};
