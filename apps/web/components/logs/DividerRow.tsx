import {
	Divider,
	Group,
	Text,
	UnstyledButton,
	useMantineTheme,
} from "@mantine/core";
import { IconChevronsDown, IconChevronsUp } from "@tabler/icons";
import { CSSProperties, FunctionComponent } from "react";
import { LogInfo } from "./LowInfo";

export const DividerRow: FunctionComponent<{
	style: CSSProperties;
	node: Extract<
		TreeNode,
		{
			type: "DIVIDER";
		}
	>;
	toggle: (
		node: Extract<
			TreeNode,
			{
				type: "DIVIDER";
			}
		>
	) => void;
	expanded: boolean;
	hiddenCount: number;
}> = ({ style, node, toggle, expanded, hiddenCount }) => {
	const theme = useMantineTheme();

	return (
		<Group noWrap align="stretch" style={style}>
			<LogInfo
				showTimestamp={false}
				useTimestampTooltip={false}
				showLine={false}
			/>

			<Divider
				label={
					<UnstyledButton onClick={() => toggle(node)}>
						<Group spacing={4}>
							{expanded ? (
								<IconChevronsUp
									size={16}
									color={theme.colors.dark[2]}
								/>
							) : (
								<IconChevronsDown
									size={16}
									color={theme.colors.dark[2]}
								/>
							)}

							<Text size="sm" color={theme.colors.dark[2]}>
								{expanded ? "Hide" : `Show ${hiddenCount} more`}
							</Text>
						</Group>
					</UnstyledButton>
				}
				labelPosition="center"
				variant="dashed"
				color={theme.colors.dark[3]}
				style={{ flexGrow: 1 }}
			/>
		</Group>
	);
};
