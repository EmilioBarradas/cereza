import { z } from "zod";
import { isDirectory } from "./utils/file";

export const OptionsSchema = z.object({
	inDir: z
		.string({
			invalid_type_error: "Input path must be a string.",
			required_error: "Input path is not specified.",
		})
		.refine(isDirectory, "Input path is not an existing directory."),
	outDir: z.string({
		invalid_type_error: "Output path must be a string.",
		required_error: "Output path is not specified.",
	}),
	verbose: z
		.boolean({
			invalid_type_error: "Verbose option must be a boolean.",
		})
		.default(false),
	data: z
		.record(z.unknown(), {
			invalid_type_error: "Data option must be a record.",
		})
		.default({}),
});

export type Options = z.infer<typeof OptionsSchema>;
