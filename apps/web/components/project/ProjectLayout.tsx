import { ProjectInfo } from "@/components/project/ProjectInfo";
import {
	Box,
	Center,
	Paper,
	Stack,
	Tabs,
	Text,
	useMantineTheme,
} from "@mantine/core";
import { IconBox, IconHammer, IconSettings } from "@tabler/icons";
import { FunctionComponent } from "react";

export const ProjectLayout: FunctionComponent<{
	project: Project;
	tabs: { [tab: string]: FunctionComponent<{ project: Project }> };
	activeTab: string;
	onTabChange: (newTab: string | null) => void;
}> = ({ project, tabs, activeTab, onTabChange }) => {
	const theme = useMantineTheme();

	return (
		<Center style={{ height: "100vh", width: "100%" }}>
			<Paper
				p={16}
				style={{ backgroundColor: theme.colors.dark[6] }}
				withBorder
			>
				<Stack spacing="xs">
					<ProjectInfo project={project} disableMenu />

					<Tabs value={activeTab} onTabChange={onTabChange}>
						<Stack>
							<Tabs.List>
								<Tabs.Tab
									value="process"
									icon={<IconBox size={16} />}
								>
									<Text size="md">Process</Text>
								</Tabs.Tab>

								<Tabs.Tab
									value="build"
									icon={<IconHammer size={16} />}
								>
									<Text size="md">Build</Text>
								</Tabs.Tab>

								<Tabs.Tab
									value="settings"
									icon={<IconSettings size={16} />}
								>
									<Text size="md">Settings</Text>
								</Tabs.Tab>
							</Tabs.List>

							<Box
								style={{ minHeight: "500px", width: "1000px" }}
							>
								{Object.entries(tabs).map(
									([name, Component]) => (
										<Tabs.Panel key={name} value={name}>
											<Component project={project} />
										</Tabs.Panel>
									)
								)}
							</Box>
						</Stack>
					</Tabs>
				</Stack>
			</Paper>
		</Center>
	);
};
