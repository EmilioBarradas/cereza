import { render } from "ink";
import React from "react";
import App from "./app";
import { Options } from "./schema";

export default (options: Options) => render(<App options={options} />);
