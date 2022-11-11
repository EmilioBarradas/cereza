import { CopyObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { z } from "zod";
import { cmd } from "./utils/cmd";

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
	files: z.array(z.string(), {
		required_error: "Files not specified.",
		invalid_type_error: "Files field must be an array of file paths.",
	}),
});

export const promote = cmd(
	PromoteSchema,
	async ({ region, bucket, version, files }) => {
		const client = new S3Client({ region });

		const resps = files.map((file) =>
			client.send(
				new CopyObjectCommand({
					Bucket: bucket,
					Key: file,
					CopySource: `/cereza-admin/releases/${version}/${file}`,
				})
			)
		);

		await Promise.allSettled(resps);
	}
);
