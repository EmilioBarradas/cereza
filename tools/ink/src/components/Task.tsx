import { Box, Text } from "ink";
import React, { FunctionComponent } from "react";
import { usePromise } from "../utils/usePromise";
import Spinner from "./Spinner";

export interface Task<T> {
	title: string;
	task: Promise<T>;
}

export const Task: FunctionComponent<{
	title: string;
	task: Promise<unknown>;
	showError?: boolean;
}> = ({ title, task, showError = false }) => {
	const state = usePromise(task);

	if (state.settled && state.error) {
		return (
			<ErrorState title={title} error={state.error} showError={showError} />
		);
	}

	if (state.settled) {
		return <SuccessState title={title} />;
	}

	return <ProgressState title={title} />;
};

const ErrorState: FunctionComponent<{
	title: string;
	error: unknown;
	showError?: boolean;
}> = ({ title, error, showError = false }) => {
	const errorMsg = error instanceof Error ? error.message : "";

	return (
		<>
			<Text>
				{title} <Text color="redBright">Failed.</Text>
			</Text>

			{showError && errorMsg.length > 0 && (
				<Box marginY={1} marginX={2}>
					<Text color="red">{errorMsg}</Text>
				</Box>
			)}
		</>
	);
};

const SuccessState: FunctionComponent<{ title: string }> = ({ title }) => {
	return (
		<Text>
			{title} <Text color="gray">Done.</Text>
		</Text>
	);
};

const ProgressState: FunctionComponent<{ title: string }> = ({ title }) => {
	return (
		<Text>
			<Spinner color="yellowBright" /> {title}
		</Text>
	);
};

export default Task;
