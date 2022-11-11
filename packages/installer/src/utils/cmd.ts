import { z } from "zod";
import { error } from "./log";

export const cmd = <T extends z.ZodTypeAny>(
	schema: T,
	cb: (input: z.input<T>) => void
) => {
	return (input: z.input<T>) => {
		const res = schema.safeParse(input);

		if (!res.success) {
			return error(res.error.issues[0].message);
		}

		cb(res.data);
	};
};
