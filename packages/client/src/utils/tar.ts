import minimatch from "minimatch";
import tar from "tar";
import { walkDir } from "./fs";

interface TarOptions {
	ignore?: string[];
}

const buildIgnore = (ignore: string[]) => {
	const exps = ignore.map((pattern) => minimatch.makeRe(pattern));
	const ignoreFn = (fileName: string) =>
		exps.some((exp) => exp.test(fileName));

	return ignoreFn;
};

export const buildTar = async (
	dir: string,
	_options: TarOptions = { ignore: [] }
) => {
	const options = _options as Required<TarOptions>;
	const ignore = buildIgnore(options.ignore);
	const include: string[] = [];

	await walkDir(dir, (fileName) => {
		if (ignore(fileName)) return;

		include.push(fileName);
	});

	return tar.create({ gzip: true, cwd: dir }, include);
};
