import chalk from "chalk";

const error = (msg: string) => console.log(chalk.redBright(msg));

export const validate = async (
	predicate: () => Promise<boolean> | boolean,
	callback: () => Promise<void> | void,
	errorMsg: string = "Predicate failed."
) => {
	if (!predicate()) {
		error(errorMsg);
		return;
	}

	await callback();
};
