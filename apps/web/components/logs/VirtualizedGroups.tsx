import {
	Box,
	Button,
	Center,
	Loader,
	MantineNumberSize,
	Paper,
	ScrollArea,
	Stack,
	useMantineTheme,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons";
import { nanoid } from "nanoid";
import {
	CSSProperties,
	FunctionComponent,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { VariableSizeList } from "react-window";
import { useScrollPosition } from "@/utils/dom/scroll_position";
import { DividerRow } from "./DividerRow";
import { LogRow } from "./LowRow";

const VirtualizedRow: FunctionComponent<{
	style: CSSProperties;
	index: number;
	data: {
		nodes: TreeNode[];
		toggle: (
			node: Extract<
				TreeNode,
				{
					type: "DIVIDER";
				}
			>
		) => void;
	};
}> = memo(({ style, index, data: { nodes, toggle } }) => {
	const node = nodes[index];

	switch (node.type) {
		case "LOG":
			const { timestamp, showTimestamp, text } = node.log;
			const { line } = node;

			return (
				<LogRow
					style={style}
					timestamp={timestamp}
					showTimestamp={showTimestamp}
					line={line}
					text={text}
				/>
			);
		case "DIVIDER":
			const { expanded, hiddenCount } = node;

			return (
				<DividerRow
					style={style}
					node={node}
					expanded={expanded}
					hiddenCount={hiddenCount}
					toggle={toggle}
				/>
			);
	}
});

VirtualizedRow.displayName = "VirtualizedRow";

export const VirtualizedGroups: FunctionComponent<{
	height: `${string}px`;
	width: `${string}px` | `${number}%`;
	groups: LogGroup[];
	rowHeight?: number;
	previewCount?: number;
	mt?: MantineNumberSize;
}> = ({
	height,
	width,
	groups,
	previewCount = 10,
	rowHeight = 25,
	mt = "md",
}) => {
	// react-window uses legacy refs. Not sure how to type this without warnings.
	const listRef = useRef<any>(null);

	const [groupMap, setGroupMap] = useState(new Map<string, LogGroup>());
	const [expandedGroups, setExpandedGroups] = useState(new Set<string>());
	const [visibleNodes, setVisibleNodes] = useState<TreeNode[]>([]);

	const createLogNode = useCallback(
		(
			log: ProcessedTextLogEntry,
			index: number,
			line: number
		): Extract<TreeNode, { type: "LOG" }> => {
			return {
				type: "LOG",
				id: log.id,
				alwaysVisible: index <= previewCount,
				height: rowHeight,
				log,
				line,
			};
		},
		[previewCount, rowHeight]
	);

	const createDividerNode = useCallback(
		(
			groupId: string,
			expanded: boolean,
			hiddenCount: number
		): Extract<TreeNode, { type: "DIVIDER" }> => {
			return {
				type: "DIVIDER",
				id: nanoid(),
				groupId,
				alwaysVisible: true,
				height: rowHeight,
				expanded,
				hiddenCount,
			};
		},
		[rowHeight]
	);

	const groupToNodes = useCallback(
		(groupId: string, startLineNum: number) => {
			let lineNum = startLineNum;

			const groupLogs = groupMap.get(groupId)?.logs ?? [];
			const isExpanded = expandedGroups.has(groupId);
			const visibleLogs = isExpanded
				? groupLogs
				: groupLogs.slice(0, previewCount);
			const nodes = visibleLogs.map<TreeNode>((log, index) =>
				createLogNode(log, index, lineNum++)
			);

			if (groupLogs.length > previewCount) {
				nodes.push(
					createDividerNode(
						groupId,
						isExpanded,
						groupLogs.length - previewCount
					)
				);
			}

			return { nodes, endLineNum: startLineNum + groupLogs.length };
		},
		[
			groupMap,
			expandedGroups,
			previewCount,
			createLogNode,
			createDividerNode,
		]
	);

	useEffect(() => {
		setGroupMap(new Map(groups.map((group) => [group.id, group])));
	}, [groups]);

	useEffect(() => {
		setExpandedGroups(new Set());
	}, [groupMap]);

	useEffect(() => {
		let lineNum = 0;

		setVisibleNodes(
			[...groupMap.keys()].flatMap((group) => {
				const { nodes, endLineNum } = groupToNodes(group, lineNum);

				lineNum = endLineNum;

				return nodes;
			})
		);
	}, [groupMap, groupToNodes]);

	const toggle = useCallback(
		({ groupId }: Extract<TreeNode, { type: "DIVIDER" }>) => {
			setExpandedGroups((curGroups) => {
				const isExpanded = curGroups.has(groupId);

				if (isExpanded) {
					curGroups.delete(groupId);
					return new Set(curGroups);
				} else {
					return new Set([...curGroups, groupId]);
				}
			});
		},
		[]
	);

	const theme = useMantineTheme();
	const {
		ref: logContainer,
		isAtBottom,
		scrollToBottom,
	} = useScrollPosition();

	useEffect(() => {
		const container = logContainer.current;
		if (container === null || !isAtBottom) return;

		scrollToBottom();
	}, [groups]);

	return (
		<Paper
			p="md"
			mt={mt}
			withBorder
			style={{
				backgroundColor: theme.colors.dark[8],
			}}
		>
			<ScrollArea
				viewportRef={logContainer}
				scrollbarSize={10}
				style={{
					height,
					width,
				}}
				onScrollPositionChange={({ y }) => {
					listRef.current?.scrollTo(y);
				}}
			>
				{groups.length === 0 && (
					<Center style={{ height: "600px" }}>
						<Loader variant="dots" color={theme.colors.dark[1]} />
					</Center>
				)}

				{groups.length > 0 && (
					<Stack align="center">
						<Box sx={{ width: "100%" }}>
							<VariableSizeList
								height={Number(height.replace("px", ""))}
								width={width}
								itemCount={visibleNodes.length}
								itemSize={(index) => visibleNodes[index].height}
								itemData={{
									nodes: visibleNodes,
									toggle,
								}}
								ref={listRef}
								style={{ overflow: undefined }}
							>
								{VirtualizedRow}
							</VariableSizeList>
						</Box>

						{!isAtBottom && (
							<Button
								variant="default"
								size="xs"
								color="gray"
								leftIcon={<IconChevronDown size={14} />}
								style={{ position: "absolute", bottom: "10px" }}
								onClick={scrollToBottom}
							>
								Scroll to bottom
							</Button>
						)}
					</Stack>
				)}
			</ScrollArea>
		</Paper>
	);
};
