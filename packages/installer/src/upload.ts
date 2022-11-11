import {
	ListObjectsCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import { readFile } from "fs/promises";
import { posix, sep } from "path";
import { z } from "zod";
import { cmd } from "./utils/cmd";
import { walkDir } from "./utils/fs";
import { error } from "./utils/log";

const UploadSchema = z.object({
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
	dir: z.string({
		required_error: "Directory not specified.",
		invalid_type_error: "Directory must be a string.",
	}),
});

export const upload = cmd(
	UploadSchema,
	async ({ region, bucket, version, dir }) => {
		const client = new S3Client({ region });

		const objs = await client.send(
			new ListObjectsCommand({
				Bucket: bucket,
				Prefix: `releases/${version}/`,
				MaxKeys: 1,
			})
		);

		if (objs.Contents !== undefined) {
			return error("A release with that version already exists.");
		}

		await walkDir(dir, async (path) => {
			const remotePath = path.split(sep).slice(1).join(posix.sep);
			const contents = await readFile(path);

			await client.send(
				new PutObjectCommand({
					Bucket: bucket,
					Key: `releases/${version}/${remotePath}`,
					Body: contents,
					ContentMD5: createHash("md5")
						.update(contents)
						.digest("base64"),
				})
			);
		});
	}
);
