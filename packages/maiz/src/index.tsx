import { render } from "ink";
import React from "react";
import App from "./app";
import type { Options } from "./schema";

export const maiz = (options: Options) =>
	render(<App options={options} />).waitUntilExit();
