import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { exportPKCS8, generateKeyPair, importPKCS8, SignJWT } from "jose";

const readOrCreatePrivateKey = async () => {
	if (existsSync(PRIVATE_KEY_PATH)) {
		return importPKCS8(await readFile(PRIVATE_KEY_PATH, "utf-8"), "ES512");
	}

	if (!existsSync(KEY_DIR_PATH)) {
		await mkdir(KEY_DIR_PATH);
	}

	const { privateKey } = await generateKeyPair("ES512");

	writeFile(PRIVATE_KEY_PATH, await exportPKCS8(privateKey));

	console.log(`Generated private key at ${PRIVATE_KEY_PATH}.`);

	return privateKey;
};

const KEY_DIR_PATH = "./data/";
const PRIVATE_KEY_PATH = KEY_DIR_PATH + "private.key";
const PRIVATE_KEY = readOrCreatePrivateKey();

export const generateUserToken = async (details: {
	userId: string;
	username: string;
}) => {
	return new SignJWT(details)
		.setProtectedHeader({ alg: "ES512" })
		.sign(await PRIVATE_KEY);
};
