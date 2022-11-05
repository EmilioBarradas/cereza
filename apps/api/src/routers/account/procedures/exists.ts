import { z } from "zod";
import { userExistsByUsername } from "../../../models/account";
import { procedure } from "../../../server/trpc";

export const accountExists = procedure
	.input(z.string())
	.query(({ input: username }) => userExistsByUsername({ username }));
