import { VirtualizedGroups } from "@/components/logs/VirtualizedGroups";
import LogBuffer from "@/utils/logs/buffer";
import LogFilter from "@/utils/logs/filter";
import LogGrouper from "@/utils/logs/grouper";
import LogIdTransformer from "@/utils/logs/transformers/id";
import LogTextTransformer from "@/utils/logs/transformers/text";
import LogTimestampTransformer from "@/utils/logs/transformers/timestamp";
import { trpc } from "@/utils/trpc";
import { MantineNumberSize } from "@mantine/core";
import { LogEntry } from "api";
import clone from "lodash.clone";
import debounce from "lodash.debounce";
import {
	FunctionComponent,
	MutableRefObject,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

const BuildDateFormatter = new Intl.DateTimeFormat("en-US", {
	dateStyle: "long",
});

const useDebounce = <T extends any>(
	initialState: T,
	options: { wait: number; maxWait?: number }
) => {
	const [state, setState] = useState<T>(initialState);
	const futureState = useRef<T>(initialState);
	const debounceSetState = useMemo(
		() =>
			debounce(
				() => {
					setState(clone(futureState.current));
				},
				options.wait,
				{
					maxWait: options.maxWait,
				}
			),
		[options]
	);
	const dispatchUpdate = useCallback(
		(updateFn: (state: MutableRefObject<T>) => void) => {
			updateFn(futureState);
			debounceSetState();
		},
		[debounceSetState]
	);

	return [state, dispatchUpdate] as [
		T,
		(updateFn: (state: MutableRefObject<T>) => void) => void
	];
};

export const VirtualizedLogs: FunctionComponent<{
	buildId: string;
	height: `${string}px`;
	width: `${string}px` | `${number}%`;
	mt?: MantineNumberSize;
}> = ({ buildId, height, width, mt = 0 }) => {
	const logFilter = useRef(new LogFilter());
	const logIdTransformer = useRef(new LogIdTransformer());
	const logTextTransfomer = useRef(new LogTextTransformer());
	const logBuffer = useRef(new LogBuffer());
	const logGrouper = useRef(new LogGrouper());
	const logTimestampTransformer = useRef(new LogTimestampTransformer());
	const [groups, updateGroups] = useDebounce<
		{ id: string; logs: ProcessedTextLogEntry[] }[]
	>([], {
		wait: 500,
		maxWait: 1000,
	});

	trpc.onBuildLog.useSubscription(buildId, {
		onData: (curEntry) => {
			logFilter.current.filter(curEntry);
		},
	});

	useEffect(() => {
		const curLogFilter = logFilter.current;
		const curLogIdTransformer = logIdTransformer.current;
		const curLogTextTransformer = logTextTransfomer.current;
		const curLogBuffer = logBuffer.current;
		const curLogGrouper = logGrouper.current;
		const curLogTimestampTransformer = logTimestampTransformer.current;

		curLogFilter.on("data", (curEntry: LogEntry) => {
			logIdTransformer.current.transform(curEntry);
		});

		curLogIdTransformer.on("data", (curEntry: IdLogEntry) => {
			logTextTransfomer.current.transform(curEntry);
		});

		curLogTextTransformer.on("data", (curEntry: TextLogEntry) => {
			logBuffer.current.push(curEntry);
		});

		curLogBuffer.on("data", (curEntry: TextLogEntry) => {
			logGrouper.current.add(curEntry);
		});

		curLogGrouper.on(
			"data",
			(logs: { id: string; logs: TextLogEntry[] }[]) => {
				logTimestampTransformer.current.transform(logs);
			}
		);

		curLogTimestampTransformer.on(
			"data",
			(groups: { id: string; logs: ProcessedTextLogEntry[] }[]) => {
				updateGroups((futureGroups) => {
					futureGroups.current = groups;
				});
			}
		);

		return () => {
			curLogFilter.removeAllListeners("data");
			curLogIdTransformer.removeAllListeners("data");
			curLogTextTransformer.removeAllListeners("data");
			curLogBuffer.removeAllListeners("data");
			curLogGrouper.removeAllListeners("data");
			curLogTimestampTransformer.removeAllListeners("data");
		};
	}, [updateGroups]);

	return (
		<VirtualizedGroups
			mt={mt}
			height={height}
			width={width}
			groups={groups}
		/>
	);
};
