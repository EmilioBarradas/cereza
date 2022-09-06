import { Button } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { trpc, trpcClient } from "@/utils/trpc";

export const getServerSideProps: GetServerSideProps = async ({
	query: { projectId },
}) => {
	if (typeof projectId !== "string") return { notFound: true };

	const project = await trpcClient.query("getProject", projectId);

	if (project === undefined) return { notFound: true };

	return {
		props: {
			project,
		},
	};
};

const Builds: NextPage<{ project: { id: number; name: string } }> = ({
	project,
}) => {
	const builds = trpc.useQuery(["getBuilds", project.id]);

	if (builds.isLoading) {
		return <>Loading...</>;
	}

	return (
		<>
			{builds.data?.map((build) => (
				<div key={build.id}>
					<Link
						href={`/projects/${project.name}/builds/${build.id}`}
						passHref
					>
						<Button>{build.id}</Button>
					</Link>
				</div>
			))}
		</>
	);
};

export default Builds;
