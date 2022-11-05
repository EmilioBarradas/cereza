export const wrapError = async <T>(
	callable: Promise<T> | (() => T | Promise<T>)
): Promise<{ success: true; data: T } | { success: false; error: unknown }> => {
	try {
		const normal = typeof callable === "function" ? callable() : callable;
		return { success: true, data: await normal };
	} catch (error) {
		return { success: false, error };
	}
};
