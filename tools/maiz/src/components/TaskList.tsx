import React from "react";
import { FunctionComponent } from "react";
import Task from "./Task";

export const TaskList: FunctionComponent<{
	tasks: Task<unknown>[];
	verbose?: boolean;
}> = ({ tasks, verbose = false }) => {
	return (
		<>
			{tasks.map(({ title, task }) => (
				<Task
					key={title}
					title={title}
					task={task}
					showError={verbose}
				/>
			))}
		</>
	);
};
