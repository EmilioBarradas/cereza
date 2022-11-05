import { trpc } from "@/utils/trpc";
import { Box, Group, Select, Stack, Title } from "@mantine/core";
import dayjs from "dayjs";
import { FunctionComponent } from "react";
import { VirtualizedLogs } from "../logs/VirtualizedLogs";

interface Build {
	id: string;
	createdAt: Date;
}

const reverse = <T extends any>(arr: T[]) => {
	return arr.reduce<T[]>((acc, cur) => [cur, ...acc], []);
};

export const BuildPanel: FunctionComponent<{
	project: Project;
}> = ({ project }) => {
	const { isLoading, data: builds } = trpc.getBuilds.useQuery(project.id);

	if (isLoading) return null;

	return (
		<Stack>
			<Group position="apart" align="center">
				<Title order={3} style={{ color: "white" }}>
					Logs
				</Title>

				<Select
					placeholder="Build"
					defaultValue={builds!.at(-1)!.id}
					data={reverse(builds!).map(({ id, createdAt }) => ({
						value: id,
						label: dayjs(createdAt).format(
							"MM-DD-YYYY hh:mm:ss.SSS"
						),
					}))}
				/>
			</Group>

			<VirtualizedLogs
				buildId={builds!.at(-1)!.id}
				height="500px"
				width="100%"
			/>
		</Stack>
	);
};
