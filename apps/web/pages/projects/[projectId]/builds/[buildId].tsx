import { VirtualizedLogs } from "@/components/logs/VirtualizedLogs";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { trpcClient } from "@/utils/trpc";
import { Center, Stack } from "@mantine/core";
import { Build } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const { projectId, buildId } = query;

	if (typeof projectId !== "string" || typeof buildId !== "string")
		return { notFound: true };

	const build = await trpcClient.getBuild.query(buildId);

	if (build === undefined) return { notFound: true };

	return {
		props: {
			build,
		},
	};
};

const Build: NextPage<{ build: Build }> = ({ build }) => {
	return (
		<Center style={{ height: "100vh", width: "100%" }}>
			<Stack style={{ width: "100%" }}>
				<PageBreadcrumb />

				<VirtualizedLogs
					buildId={build.id}
					height="600px"
					width="100%"
				/>
			</Stack>
		</Center>
	);
};

export default Build;
