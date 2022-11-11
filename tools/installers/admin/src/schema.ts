import { z } from "zod";
import semver from "semver-regex";

const versionSchema = (flag: string) => {
	return z
		.string({
			required_error: `'${flag}' flag not specified.`,
			invalid_type_error: `'${flag}' flag must be a string.`,
		})
		.regex(semver(), `'${flag}' flag is not in correct semver format.`);
};

export const VersionSchema = z.object({
	version: versionSchema("version"),
});

export const AllVersionSchema = VersionSchema.merge(
	z.object({
		"api-version": versionSchema("api-version").optional(),
		"web-version": versionSchema("web-version").optional(),
	})
);
