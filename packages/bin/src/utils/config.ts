import { resolve } from "path";
import { z } from "zod";
import { wrapError } from "../utils/wrapError";
import { fileExists } from "./file";

const ConfigSchema = z.object({
	pack: z.object({
		templateDirs: z.array(z.string(), {
			required_error: "Template directories field not specified.",
			invalid_type_error:
				"Template directories field must be an array of directory paths.",
		}),
		staticDirs: z.array(z.string(), {
			required_error: "Static directories field not specified.",
			invalid_type_error:
				"Static directories field must be an array of directory paths.",
		}),
		outDir: z.string({
			required_error: "Output directory field not specified.",
			invalid_type_error: "Output directory field must be a string.",
		}),
	}),
	upload: z.object({
		inDir: z.string({
			required_error: "Input directory field not specified.",
			invalid_type_error: "Input directory field must be a string.",
		}),
	}),
	promote: z
		.object({
			paths: z.array(z.string()).default([]),
		})
		.default({}),
	aws: z.object({
		region: z.string({
			required_error: "AWS region field not specified.",
			invalid_type_error: "AWS region field must be a string.",
		}),
		bucket: z.string({
			required_error: "AWS bucket field not specified.",
			invalid_type_error: "AWS bucket field must be a string.",
		}),
	}),
});

export type Config = z.infer<typeof ConfigSchema>;

const CONFIG_REL_PATH = "installer.js";

export const loadConfig = async () => {
	const configPath = resolve(CONFIG_REL_PATH);
	const exists = await fileExists(configPath);

	if (!exists) {
		throw Error(`Configuration file not found: ${configPath}`);
	}

	const module = await wrapError(import(configPath));

	if (module.failed) {
		throw Error("Could not load configuration file.");
	}

	const config = ConfigSchema.safeParse(module.data);

	if (!config.success) {
		throw Error(config.error.issues[0].message);
	}

	return config.data;
};
