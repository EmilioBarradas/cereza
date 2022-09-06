import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import z from "zod";
import decodeJwt from "jwt-decode";

const CONFIG_PATH = resolve("./cereza.config.js");

const missingError = (prop: string) => `Config is missing ${prop} property.`;

const ConfigSchema = z.object({
	server: z.string({ required_error: missingError("server") }),
	id: z.string({ required_error: missingError("id") }),
	name: z.string({ required_error: missingError("name") }),
	ports: z.record(z.number()).default({}),
});

export const configExists = () => {
	return existsSync(CONFIG_PATH);
};

export const loadConfig = async () => {
	const exists = existsSync(CONFIG_PATH);

	if (exists) {
		const { default: config } = await import(`file://${CONFIG_PATH}`);

		const result = ConfigSchema.safeParse(config);

		if (result.success) {
			return result.data;
		} else {
			throw new Error(result.error.errors[0].message);
		}
	} else {
		throw new Error(
			`Cereza configuration file not found. Use "cereza init" to create one.`
		);
	}
};

export const loadTokens = async () => {
	const tokensPath = resolve(__dirname, "..", ".cereza");
	const tokenData = existsSync(tokensPath)
		? await readFile(tokensPath, "utf-8")
		: "{}";

	return JSON.parse(tokenData) as Record<string, string>;
};

export const loadDecodedTokens = async () => {
	const tokens = await loadTokens();

	return Object.entries(tokens).reduce<
		Record<string, { userId: string; username: string }>
	>(
		(acc, [server, encodedToken]) => ({
			...acc,
			[server]: decodeJwt(encodedToken),
		}),
		{}
	);
};

export const getAvailableServers = async () => {
	return Object.keys(await loadTokens());
};

export const getToken = async (server: string) => {
	const tokens = await loadDecodedTokens();
	const token = tokens[server];

	if (token !== undefined) {
		return token;
	} else {
		throw new Error(
			`You are not logged in. Use "cereza login" to log in to a cereza server.`
		);
	}
};

export const updateToken = async (server: string, token: string) => {
	const tokensPath = resolve(__dirname, "..", ".cereza");
	const tokens = await loadTokens();

	tokens[server] = token;

	await writeFile(tokensPath, JSON.stringify(tokens, null, 4));
};
