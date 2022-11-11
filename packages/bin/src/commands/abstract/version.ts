import { Flags } from "@oclif/core";
import ConfigCommand from "./config";
import semverRegex from "semver-regex";

const isSemver = async (input: string) => {
	if (!semverRegex().test(input)) {
		throw new Error(`${input} does not follow semver semantics.`);
	}

	return input;
};

const semver = Flags.custom({ parse: isSemver });

export default abstract class VersionCommand extends ConfigCommand {
	static flags = {
		version: semver({
			char: "v",
			required: true,
		}),
	};
}
