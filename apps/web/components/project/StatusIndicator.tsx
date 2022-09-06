import {
	Box,
	MantineSize,
	Text,
	Tooltip,
	useMantineTheme,
} from "@mantine/core";
import { CSSProperties, FunctionComponent } from "react";

type SizeStyles = { [Size in MantineSize]: CSSProperties };
type TooltipSizes = { [Size in MantineSize]: MantineSize };

export const StatusIndicator: FunctionComponent<{
	status: string;
	size?: MantineSize;
}> = ({ status, size = "md" }) => {
	const theme = useMantineTheme();

	const baseStyle: CSSProperties = {
		borderRadius: "100%",
		backgroundColor:
			status === "Online" ? theme.colors.green[4] : theme.colors.red[4],
	};
	const sizeStyles: SizeStyles = {
		xs: {},
		sm: {
			height: "8px",
			width: "8px",
		},
		md: {
			height: "10px",
			width: "10px",
		},
		lg: {
			height: "12px",
			width: "12px",
		},
		xl: {},
	};
	const tooltipSizes: TooltipSizes = {
		xs: "xs",
		sm: "xs",
		md: "xs",
		lg: "sm",
		xl: "sm",
	};

	return (
		<Tooltip
			label={<Text size={tooltipSizes[size]}>{status}</Text>}
			color="dark"
			position="right"
			withArrow
		>
			<Box style={{ ...baseStyle, ...sizeStyles[size] }} />
		</Tooltip>
	);
};
