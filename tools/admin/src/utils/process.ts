import chalk from "chalk";
import { oraPromise } from "ora";

const getErrorMessage = (err: unknown) => {
	if (!(err instanceof Error)) {
		return "Failed.";
	}

	const lines = chalk
		.red(err.message)
		.split("\n")
		.map((line) => `    ${line}`)
		.join("\n");

	return `\n\n${lines}\n`;
};

export const process = async (
	title: string,
	process: () => Promise<unknown>
) => {
	try {
		const promise = oraPromise(process, {
			text: title,
		});
		console.log("");

		await promise;

		console.log(title, chalk.gray("Done."));
	} catch (err) {
		console.log(title, chalk.redBright("Failed."), getErrorMessage(err));
	}
};
