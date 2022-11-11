import { cp, mkdir, rm } from "fs/promises";
import { z } from "zod";
import { cmd } from "./utils/cmd";
import maiz from "maiz";
import { wrapError } from "./utils/wrapError";

const PackSchema = z.object({
	data: z.record(z.unknown(), {
		required_error: "Data not specified.",
		invalid_type_error: "Data field must be a record.",
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
		const rmRes = await wrapError(
			rm(outDir, { recursive: true, force: true })
		);

		if (rmRes.failed) {
			throw new Error(`Could not delete output directory: '${outDir}'.`);
		}

		const mkdirRes = await wrapError(mkdir(outDir, { recursive: true }));

		if (mkdirRes.failed) {
			throw new Error(`Could not create output directory: '${outDir}'.`);
		}

		const cpPromises = staticDirs.map(async (dir) => {
			const cpRes = await wrapError(cp(dir, outDir, { recursive: true }));

			if (!cpRes.failed) return;

			throw new Error(`Could not copy static directory: '${dir}'.`);
		});

		await Promise.all(cpPromises);

		for (const templateDir of templateDirs) {
			maiz({
				inDir: templateDir,
				outDir,
				data,
			});
		}
	}
);
