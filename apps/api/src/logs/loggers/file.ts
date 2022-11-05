import { readFile, writeFile } from "fs/promises";
import type { FileDeploymentLoggerOptions, LogEntry } from "../types";
import { MemoryDeploymentLogger } from "./memory";

export class FileDeploymentLogger extends MemoryDeploymentLogger {
	private readonly buildId: string;
	private readonly file: string;

	constructor({ memory, buildId, file }: FileDeploymentLoggerOptions) {
		super(memory);

		this.buildId = buildId;
		this.file =
			file ?? `../../storage/uploads/${this.buildId}/deployment.log`;
	}

	public async load() {
		(await readFile(this.file, "utf-8"))
			.split(/\n/)
			.map<LogEntry>((line) => JSON.parse(line))
			.forEach((log) => this.entry(log));
	}

	public async save() {
		const lines = [];

		for await (const log of this) {
			lines.push(JSON.stringify(log));
		}

		await writeFile(this.file, lines.join("\n"));
	}
}
