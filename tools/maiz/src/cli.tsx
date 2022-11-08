#!/usr/bin/env node
import { render } from "ink";
import meow from "meow";
import React from "react";
import App from "./app.js";

const HELP_MESSAGE = `
    Usage
      $ ink

    Options
      --name  Your name

    Examples
      $ ink --name=Jane
      Hello, Jane
`;

const cli = meow(HELP_MESSAGE, {
	flags: {
		in: {
			type: "string",
			isRequired: true,
		},
		out: {
			type: "string",
			isRequired: true,
		},
		verbose: {
			alias: "v",
			type: "boolean",
			default: false,
		},
	},
});

render(
	<App
		inDir={cli.flags.in}
		outDir={cli.flags.out}
		verbose={cli.flags.verbose}
		flags={cli.flags}
	/>
);
