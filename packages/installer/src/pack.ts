import { cp, mkdir, rm } from "fs/promises";
import { z } from "zod";
import { cmd } from "./utils/cmd";
import { run } from "./utils/process";

const PackSchema = z.object({
	data: z.array(z.string(), {
		required_error: "Data not specified.",
		invalid_type_error: "Data field must be an array of strings.",
	}),
	templateDirs: z.array(z.string(), {
		required_error: "Template directories not specified.",
		invalid_type_error:
			"Template directories field must be an array of directory paths.",
	}),
	staticDirs: z.array(
		z.string({
			required_error: "Static directories not specified.",
			invalid_type_error:
				"Static directories field must be an array of directory paths.",
		})
	),
	outDir: z.string({
		required_error: "Out directory not specified.",
		invalid_type_error: "Out directory must be a string.",
	}),
});

export const pack = cmd(
	PackSchema,
	async ({ outDir, templateDirs, staticDirs, data }) => {
		await rm(outDir, { recursive: true, force: true });
		await mkdir(outDir, { recursive: true });

		for (const staticDir of staticDirs) {
			await cp(staticDir, outDir, { recursive: true });
		}

		for (const templateDir of templateDirs) {
			await run(`npx maiz --in ${templateDir} --out ${outDir}`, data);
		}
	}
);
