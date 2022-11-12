import { z } from "zod";

export const cmd = <T extends z.ZodTypeAny, U>(
	schema: T,
	cb: (input: z.input<T>) => U
) => {
	return (input: z.input<T>) => {
		const res = schema.safeParse(input);

		// Typescript v4.8.4 does not properly infer the discriminated union if using (!res.success).
		if (res.success == false) {
			throw new Error(res.error.issues[0].message);
		}

		return cb(res.data);
	};
};
