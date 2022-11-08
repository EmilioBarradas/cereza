import { useMemo, useRef, useState } from "react";
import { wrapError } from "./wrapError";

export type State<T> =
	| { settled: false }
	| { settled: true; failed: false; error: undefined; data: T }
	| { settled: true; failed: true; error: unknown; data: undefined };

export const usePromise = <T>(promise: Promise<T>): State<T> => {
	const id = useRef(0);
	const [state, setState] = useState<State<T>>({ settled: false });

	useMemo(async () => {
		const thenId = Math.random();

		id.current = thenId;
		setState({ settled: false });

		const data = await wrapError(promise);
		if (thenId !== id.current) return;

		setState({ settled: true, ...data });
	}, [promise]);

	return state;
};
