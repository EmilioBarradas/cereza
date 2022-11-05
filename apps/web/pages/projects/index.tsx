import { ProjectInfo } from "@/components/project/ProjectInfo";
import { trpc } from "@/utils/trpc";
import { Card, Container, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { NextPage } from "next";
import { FunctionComponent } from "react";

const ProjectCard: FunctionComponent<{ project: Project }> = ({ project }) => {
	return (
		<Card withBorder style={{ width: "300px" }}>
			<ProjectInfo project={project} size="sm" withHref />
		</Card>
	);
};

const Home: NextPage = () => {
	const { isLoading, data: projects } = trpc.getProjects.useQuery();

	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	return (
		<Container mt={96}>
			<Stack spacing="xl">
				<Title order={2} style={{ color: "white" }}>
					Projects
				</Title>

				<SimpleGrid cols={3} spacing="xl">
					{projects?.map((project) => (
						<ProjectCard key={project.name} project={project} />
					))}
				</SimpleGrid>
			</Stack>
		</Container>
	);
};

export default Home;
