import { useMemo, useRef, useState } from "react";
import { wrapError } from "./wrapError";

export type State<T, U> =
	| { settled: false }
	| { settled: true; failed: false; error: undefined; data: T }
	| { settled: true; failed: true; error: U; data: undefined };

export const usePromise = <T, U>(promise: Promise<T>): State<T, U> => {
	const id = useRef(0);
	const [state, setState] = useState<State<T, U>>({ settled: false });

	useMemo(async () => {
		const thenId = Math.random();

		id.current = thenId;
		setState({ settled: false });

		const data = await wrapError<T, U>(promise);
		if (thenId !== id.current) return;

		setState({ settled: true, ...data });
	}, [promise]);

	return state;
};
