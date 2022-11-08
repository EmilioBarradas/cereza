import { Text } from "ink";
import React, { FunctionComponent, useEffect, useState } from "react";
import { ForegroundColor } from "chalk";
import { LiteralUnion } from "type-fest";

const DOTS = {
	interval: 80,
	frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
};

const Spinner: FunctionComponent<{
	color?: LiteralUnion<typeof ForegroundColor, string>;
}> = ({ color }) => {
	const [frame, setFrame] = useState(0);
	const { interval, frames } = DOTS;

	useEffect(() => {
		const id = setInterval(
			() => setFrame((curFrame) => (curFrame + 1) % frames.length),
			interval
		);

		return () => clearInterval(id);
	}, []);

	return <Text color={color}>{frames[frame]}</Text>;
};

export default Spinner;
