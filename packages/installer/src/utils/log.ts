import chalk from "chalk";
import { log } from "console";

export const error = (msg: string) => log(chalk.redBright("!", msg));

export const info = (msg: string) => log(chalk.dim("$", msg));
