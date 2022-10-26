#!/usr/bin/env zx

const packApi = async () => {
	await $`mkdir -p ./dist/api/prisma`;

	await Promise.all([
		$`cp -r ../../../api/dist ./dist/api/dist`,
		$`cp -r ../../../api/node_modules ./dist/api/node_modules`,
		$`cp ../../../api/package.json ./dist/api/package.json`,
		$`cp ../../../api/prisma/schema.prisma ./dist/api/prisma/schema.prisma`,
	]);

	await $`prisma db push --schema=./dist/api/prisma/schema.prisma`;
};

const packWeb = async () => {
	await $`cp -r ../../../web/.next/standalone ./dist/web`;
};

await Promise.all([packApi(), packWeb()]);
