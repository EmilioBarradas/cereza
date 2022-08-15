import { prisma } from "database/src";
import { readFile, writeFile } from "fs/promises";
import { EventEmitter } from "events";

export interface LogEntry {
    timestamp: number;
    type: string;
    data: any;
}

export class DeploymentLoggers {
    private static readonly loggers = new Map<string, MemoryDeploymentLogger>();

    static async of(buildId: string) {
        const buildRequest = await prisma.buildRequest.findFirst({
            where: { id: buildId },
        });

        if (buildRequest === null) throw new Error("Build request not found.");

        if (buildRequest.finished) {
            const logger = new FileDeploymentLogger({ buildId });

            await logger.load();
            logger.end();

            return logger;
        } else {
            const logger = this.loggers.get(buildId);

            if (logger === undefined)
                throw new Error("Deployment logger not found.");

            return logger;
        }
    }

    static create(buildId: string) {
        this.loggers.set(buildId, new MemoryDeploymentLogger());
    }

    static delete(buildId: string) {
        this.loggers.delete(buildId);
    }
}

class PersistedReadableStream<T> {
    private readonly toSend: T[] = [];
    private readonly emitter = new EventEmitter();

    private history: T[] = [];
    private closed = false;

    constructor(stream?: PersistedReadableStream<T>) {
        if (stream === undefined) return;

        this.history = stream.history;
        this.closed = stream.closed;
    }

    protected enqueue(chunk: T) {
        this.history.push(chunk);
        this.toSend.push(chunk);
        this.emitter.emit("data");
    }

    protected close() {
        this.closed = true;
        this.emitter.emit("end");
    }

    public async *[Symbol.asyncIterator]() {
        this.toSend.push(...this.history);

        while (true) {
            try {
                while (this.toSend.length > 0) {
                    yield this.toSend.shift()!;
                }

                if (this.closed) break;

                await new Promise((res, rej) => {
                    this.emitter.once("data", res);
                    this.emitter.once("end", rej);
                });
            } catch (err) {
                break;
            }
        }
    }
}

export class MemoryDeploymentLogger extends PersistedReadableStream<LogEntry> {
    constructor(logger?: MemoryDeploymentLogger) {
        super(logger);
    }

    public data(type: string, data = {}, timestamp = Date.now()) {
        this.enqueue({ timestamp, type, data });
    }

    public entry(entry: LogEntry) {
        this.data(entry.type, entry.data, entry.timestamp);
    }

    public end() {
        this.close();
    }
}

export class FileDeploymentLogger extends MemoryDeploymentLogger {
    private readonly buildId: string;
    private readonly file: string;

    constructor(options: {
        buildId: string;
        file?: string;
        memory?: MemoryDeploymentLogger;
    }) {
        super(options.memory);

        this.buildId = options.buildId;
        this.file =
            options.file ??
            `../../storage/uploads/${this.buildId}/deployment.log`;
    }

    public async load() {
        const data = await readFile(this.file, "utf-8");
        const lines = data.split(/\r?\n/);
        const logs = lines.map<LogEntry>((line) => JSON.parse(line));

        for (const entry of logs) {
            this.entry(entry);
        }
    }

    public async save() {
        let lines: string[] = [];

        for await (const log of this) {
            lines.push(JSON.stringify(log));
        }

        const data = lines.join("\r\n");

        await writeFile(this.file, data);
    }
}
