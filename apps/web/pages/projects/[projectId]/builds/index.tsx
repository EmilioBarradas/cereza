import { Button } from "@mantine/core";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { trpc, trpcClient } from "@/utils/trpc";

export const getServerSideProps: GetServerSideProps = async ({
	query: { projectId },
}) => {
	if (typeof projectId !== "string") return { notFound: true };

	const project = await trpcClient.getProject.query(projectId);

	if (project === undefined) return { notFound: true };

	return {
		props: {
			project,
		},
	};
};

const Builds: NextPage<{ project: { id: string; name: string } }> = ({
	project,
}) => {
	const { isLoading, data: builds } = trpc.getBuilds.useQuery(project.id);

	if (isLoading) {
		return <>Loading...</>;
	}

	return (
		<>
			{builds?.map((build) => (
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
