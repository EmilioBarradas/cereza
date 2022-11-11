import { Box, Text } from "ink";
import { basename, join } from "path";
import React, { FunctionComponent, useMemo } from "react";
import Task from "./components/Task";
import { TaskList } from "./components/TaskList";
import { Options, OptionsSchema } from "./schema";
import { getFiles } from "./utils/file";
import { template } from "./utils/template";
import { usePromise } from "./utils/usePromise";
import { ZodError } from "zod";

const App: FunctionComponent<{
	options: Options;
}> = ({ options: _options }) => {
	const optionsP = useMemo(
		() => OptionsSchema.parseAsync(_options),
		[_options]
	);
	const options = usePromise<Options, ZodError<Options>>(optionsP);

	if (!options.settled) return null;

	if (options.failed) {
		return (
			<Text color="redBright">{options.error.issues[0]?.message}</Text>
		);
	}

	return <InputValidatedApp options={options.data} />;
};

const InputValidatedApp: FunctionComponent<{
	options: Options;
}> = ({ options: { inDir, outDir, verbose, flags } }) => {
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

const AppWithTasks: FunctionComponent<{
	tasks: Task<unknown>[];
	verbose?: boolean;
}> = ({ tasks, verbose = false }) => {
	return (
		<Box flexDirection="column" marginY={1}>
			<Text underline>Template Generation</Text>

			<Box flexDirection="column" marginTop={1} marginX={2}>
				<TaskList tasks={tasks} verbose={verbose} />
			</Box>
		</Box>
	);
};

export default App;
