import { templates } from "./utils/template";
import { validate } from "./utils/validate";
import { rm } from "fs/promises";
import minimist from "minimist";

const TEMPLATE_DIR = "templates";
const GENERATED_DIR = "generated";

const argv = minimist(process.argv.slice(2));

const main = async () => {
	await rm(GENERATED_DIR, { recursive: true, force: true });
	await templates(TEMPLATE_DIR, GENERATED_DIR, argv);
};

const run = async () => {
	console.log("");

	await validate(
		() => argv.version !== undefined,
		main,
		"Version not provided."
	);

	console.log("");
};

run();
