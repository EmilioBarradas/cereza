import { lstat } from "fs/promises";
import { Box, Text } from "ink";
import { basename, join } from "path";
import React, { FunctionComponent, useMemo } from "react";
import Task from "./components/Task.js";
import { TaskList } from "./components/TaskList.js";
import { getFiles } from "./utils/file.js";
import { template } from "./utils/template.js";
import { usePromise } from "./utils/usePromise.js";

const AppWithTasks: FunctionComponent<{
	tasks: Task<unknown>[];
	verbose?: boolean;
}> = ({ tasks, verbose = false }) => {
	return (
		<>
			<Text underline>Template Generation</Text>

			<Box flexDirection="column" marginY={1} marginX={2}>
				<TaskList tasks={tasks} verbose={verbose} />
			</Box>
		</>
	);
};

const AppWithFiles: FunctionComponent<{
	files: string[];
	outDir: string;
	verbose?: boolean;
	flags?: Record<string, unknown>;
}> = ({ files, outDir, verbose = false, flags = {} }) => {
	const tasks = files.map((path) => {
		const outPath = join(outDir, basename(path));

		const data = Object.entries(flags).reduce<Record<string, string>>(
			(acc, [key, value]) => {
				return { ...acc, [key]: String(value) };
			},
			{}
		);

		return {
			title: outPath,
			task: template(path, outPath, data),
		};
	});

	return <AppWithTasks tasks={tasks} verbose={verbose} />;
};

const InputValidatedApp: FunctionComponent<{
	inDir: string;
	outDir: string;
	verbose?: boolean;
	flags?: Record<string, unknown>;
}> = ({ inDir, outDir, verbose = false, flags = {} }) => {
	const filesP = useMemo(() => getFiles(inDir), [inDir]);
	const files = usePromise(filesP);

	if (!files.settled) return null;

	if (files.failed || files.data.length === 0) {
		return <Text>Generated 0 files.</Text>;
	}

	return (
		<AppWithFiles
			files={files.data}
			outDir={outDir}
			verbose={verbose}
			flags={flags}
		/>
	);
};

const App: FunctionComponent<{
	inDir: string;
	outDir: string;
	verbose?: boolean;
	flags?: Record<string, unknown>;
}> = ({ inDir, outDir, verbose = false, flags = {} }) => {
	const statP = useMemo(() => lstat(inDir), [inDir]);
	const stat = usePromise(statP);

	if (!stat.settled) return null;

	if (stat.settled && stat.failed) {
		return <Text color="redBright">Input path does not exist.</Text>;
	}

	if (stat.settled && stat.data.isFile()) {
		return <Text color="redBright">Input path is not a directory.</Text>;
	}

	return (
		<InputValidatedApp
			inDir={inDir}
			outDir={outDir}
			verbose={verbose}
			flags={flags}
		/>
	);
};

export default App;
