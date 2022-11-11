import { CopyObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";
import { cmd } from "./utils/cmd";
import { wrapError } from "./utils/wrapError";

const PromoteSchema = z.object({
	region: z.string({
		required_error: "Region not specified.",
		invalid_type_error: "Region must be a string.",
	}),
	bucket: z.string({
		required_error: "Bucket not specified.",
		invalid_type_error: "Bucket must be a string.",
	}),
	version: z.string({
		required_error: "Version not specified.",
		invalid_type_error: "Version must be a string.",
	}),
	paths: z.array(z.string(), {
		required_error: "Paths not specified.",
		invalid_type_error: "Paths field must be an array of file paths.",
	}),
});

export const promote = cmd(
	PromoteSchema,
	async ({ region, bucket, version, paths }) => {
		const client = new S3Client({ region });

		const cpPromises = paths.map(async (path) => {
			const cpRes = await wrapError(
				client.send(
					new CopyObjectCommand({
						Bucket: bucket,
						Key: path,
						CopySource: `/cereza-admin/releases/${version}/${path}`,
					})
				)
			);

			if (!cpRes.failed) return;

			throw new Error(`Failed to transfer file: ${path}`);
		});

		await Promise.all(cpPromises);
	}
);
