import { buildTar } from "../utils/tar";
import { getIgnoreGlobs } from "./glob";
import axios from "axios";

export const uploadDir = async (dir: string, buildId: string) => {
	const ignore = await getIgnoreGlobs(dir);
	const stream = await buildTar(dir, { ignore });

	await axios.post<{ success: true; data: {} }>(
		"http://localhost:59213/api/upload",
		stream,
		{
			headers: {
				"Content-Type": "application/octet-stream",
				"Build-ID": buildId,
			},
			maxBodyLength: Infinity,
		}
	);
};
