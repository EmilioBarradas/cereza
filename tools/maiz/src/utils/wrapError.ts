export const wrapError = async <T, U>(data: Promise<T>) => {
	try {
		return { failed: false as const, error: undefined, data: await data };
	} catch (error) {
		return { failed: true as const, error: error as U, data: undefined };
	}
};
