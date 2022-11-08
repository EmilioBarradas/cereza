export const wrapError = async <T>(data: Promise<T>) => {
	try {
		return { failed: false as const, error: undefined, data: await data };
	} catch (error) {
		return { failed: true as const, error, data: undefined };
	}
};
