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
import { wrapError } from "./utils/wrapError";

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
	inDir: z.string({
		required_error: "Directory not specified.",
		invalid_type_error: "Directory must be a string.",
	}),
});

export const upload = cmd(
	UploadSchema,
	async ({ region, bucket, version, inDir }) => {
		const client = new S3Client({ region });

		const objs = await client.send(
			new ListObjectsCommand({
				Bucket: bucket,
				Prefix: `releases/${version}/`,
				MaxKeys: 1,
			})
		);

		if (objs.Contents !== undefined) {
			throw new Error("A release with that version already exists.");
		}

		const uploadFile = async (path: string) => {
			const remotePath = path.split(sep).slice(1).join(posix.sep);
			const fileRes = await wrapError(readFile(path));

			if (fileRes.failed) return;

			await client.send(
				new PutObjectCommand({
					Bucket: bucket,
					Key: `releases/${version}/${remotePath}`,
					Body: fileRes.data,
					ContentMD5: createHash("md5")
						.update(fileRes.data)
						.digest("base64"),
				})
			);
		};

		const walkRes = await wrapError(walkDir(inDir, uploadFile));

		if (walkRes.failed) {
			throw new Error(`Could not walk directory: ${inDir}.`);
		}
	}
);
