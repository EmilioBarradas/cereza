import { BuildPanel } from "@/components/project/BuildPanel";
import { ProjectLayout } from "@/components/project/ProjectLayout";
import { ProcessPanel } from "@/components/project/ProcessPanel";
import { SettingsPanel } from "@/components/project/SettingsPanel";
import { trpcClient } from "@/utils/trpc";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async ({
	query: { projectId },
}) => {
	if (typeof projectId !== "string") return { notFound: true };

	const project = await trpcClient.query("getProject", projectId);

	if (project === null) return { notFound: true };

	return {
		props: {
			project,
		},
	};
};

const ProjectPage: NextPage<{
	project: Project;
}> = ({ project }) => {
	const router = useRouter();

	return (
		<ProjectLayout
			project={project}
			tabs={{
				process: ProcessPanel,
				build: BuildPanel,
				settings: SettingsPanel,
			}}
			activeTab={router.query.tab as string}
			onTabChange={(newTab) => {
				router.push(`/projects/${project.name}/${newTab}`);
			}}
		/>
	);
};

export default ProjectPage;
