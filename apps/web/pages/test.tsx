import { trpc } from "@/utils/trpc";
import {
	ActionIcon,
	Box,
	Card,
	Container,
	Group,
	Menu,
	SimpleGrid,
	Stack,
	Text,
	Title,
	Tooltip,
	useMantineTheme,
} from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { NextPage } from "next";
import Link from "next/link";
import { FunctionComponent } from "react";

dayjs.extend(relativeTime);

const ProjectCard: FunctionComponent<{ project: Project }> = ({
	project: { name, status, owner, updatedAt },
}) => {
	const theme = useMantineTheme();

	return (
		<Card withBorder style={{ width: "300px" }}>
			<Stack spacing={4}>
				<Group position="apart">
					<Group spacing="xs">
						<Link href={`/projects/${name}/builds`} passHref>
							<Text component="a" weight="bold" color="white">
								{name}
							</Text>
						</Link>

						<Tooltip
							label={<Text size="xs">{status}</Text>}
							color="dark"
							position="right"
							withArrow
						>
							<Box
								style={{
									height: "8px",
									width: "8px",
									borderRadius: "100%",
									backgroundColor:
										status === "Online"
											? theme.colors.green[4]
											: theme.colors.red[4],
								}}
							/>
						</Tooltip>
					</Group>

					<Menu shadow="lg" withinPortal width={200} withArrow>
						<Menu.Target>
							<ActionIcon>
								<IconDots size={16} />
							</ActionIcon>
						</Menu.Target>

						<Menu.Dropdown>
							<Menu.Label>Application</Menu.Label>
							<Menu.Item icon={<IconEdit size={14} />}>
								Rename
							</Menu.Item>

							<Menu.Divider />

							<Menu.Label>Danger zone</Menu.Label>
							<Menu.Item
								color="red"
								icon={<IconTrash size={14} />}
							>
								Delete
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Group>

				<Group position="apart">
					<Text color={theme.colors.dark[0]} weight={400} size="sm">
						{owner.name}
					</Text>

					<Tooltip
						label={
							<Text size="xs">
								{`Last updated ${dayjs(updatedAt).format(
									"MMMM D, YYYY"
								)}.`}
							</Text>
						}
						color="dark"
						position="bottom"
						withArrow
						withinPortal
					>
						<Text
							color={theme.colors.dark[0]}
							weight={400}
							size="sm"
						>
							{dayjs(updatedAt).fromNow()}
						</Text>
					</Tooltip>
				</Group>
			</Stack>
		</Card>
	);
};

const Test: NextPage = () => {
	const projects = trpc.useQuery(["getProjects"]);

	if (projects.isLoading) {
		return <Text>Loading...</Text>;
	}

	return (
		<Container mt={96}>
			<Stack spacing="xl">
				<Title order={2} style={{ color: "white" }}>
					Projects
				</Title>

				<SimpleGrid cols={3} spacing="xl">
					{projects.data?.map((project) => (
						<ProjectCard key={project.name} project={project} />
					))}
				</SimpleGrid>
			</Stack>
		</Container>
	);
};

export default Test;
