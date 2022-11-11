import { spawn } from "child_process";
import { info } from "./log";

export const run = (cmd: string, extraArgs: string[]) => {
	info(cmd);

	const [name, ...args] = cmd.split(" ");

	const p = spawn(name, [...args, ...extraArgs], {
		shell: true,
		env: {
			FORCE_COLOR: "1",
		},
	});

	p.stdout.pipe(process.stdout);

	return new Promise((res) => p.addListener("exit", res));
};
