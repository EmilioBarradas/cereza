export const negate = <T>(fn: (...args: T[]) => boolean | Promise<boolean>) => {
	return async (...args: T[]) => {
		return !(await fn(...args));
	};
};
