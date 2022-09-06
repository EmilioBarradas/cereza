import { useCallback, useEffect, useRef, useState } from "react";

export const useScrollPosition = () => {
	const ref = useRef<HTMLDivElement>(null);
	const [isAtTop, setIsAtTop] = useState(false);
	const [isAtBottom, setIsAtBottom] = useState(false);

	const scrollToTop = useCallback(() => {
		const container = ref.current;
		if (container === null) return;

		container.scrollTo({
			top: 0,
		});
	}, []);

	const scrollToBottom = useCallback(() => {
		const container = ref.current;
		if (container === null) return;

		container.scrollTo({
			top: container.scrollHeight,
		});
	}, []);

	const scrollHandler = useCallback(() => {
		const container = ref.current;
		if (container === null) return;

		const isScrolledToTop = container.scrollTop === 0;
		const isScrolledToBottom =
			container.scrollHeight - container.clientHeight <=
			container.scrollTop + 1;

		setIsAtTop(isScrolledToTop);
		setIsAtBottom(isScrolledToBottom);
	}, []);

	useEffect(scrollHandler, [scrollHandler]);

	useEffect(() => {
		const container = ref.current;
		if (container === null) return;

		container.addEventListener("scroll", scrollHandler);

		return () => {
			container.removeEventListener("scroll", scrollHandler);
		};
	}, [scrollHandler]);

	return { ref, isAtTop, isAtBottom, scrollToTop, scrollToBottom };
};
