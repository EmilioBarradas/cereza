/** @type {import('packer').Config} */
module.exports = {
	pack: {
		templateDirs: ["templates"],
		staticDirs: ["static"],
		outDir: "dist",
	},
	upload: {
		inDir: "dist",
	},
	promote: {
		paths: [],
	},
	aws: {
		region: "{{awsRegion}}",
		bucket: "{{awsBucket}}",
	},
};
