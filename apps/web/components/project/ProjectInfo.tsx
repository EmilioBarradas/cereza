import {
	ActionIcon,
	Group,
	MantineNumberSize,
	MantineSize,
	Menu,
	Stack,
	Text,
	Tooltip,
	useMantineTheme,
} from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { FunctionComponent } from "react";
import { StatusIndicator } from "./StatusIndicator";

dayjs.extend(relativeTime);

const ProjectActionsMenu: FunctionComponent = () => {
	return (
		<Menu shadow="lg" withinPortal width={200} withArrow>
			<Menu.Target>
				<ActionIcon>
					<IconDots size={16} />
				</ActionIcon>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Label>Application</Menu.Label>
				<Menu.Item icon={<IconEdit size={14} />}>Rename</Menu.Item>

				<Menu.Divider />

				<Menu.Label>Danger zone</Menu.Label>
				<Menu.Item color="red" icon={<IconTrash size={14} />}>
					Delete
				</Menu.Item>
			</Menu.Dropdown>
		</Menu>
	);
};

const TimeSince: FunctionComponent<{ date: Date; size: MantineSize }> = ({
	date,
	size,
}) => {
	const theme = useMantineTheme();

	const props = {
		xs: {
			text: {
				size: "sm" as MantineSize,
			},
			tooltip: {
				size: "xs" as MantineSize,
			},
		},
		sm: {
			text: {
				size: "sm" as MantineSize,
			},
			tooltip: {
				size: "xs" as MantineSize,
			},
		},
		md: {
			text: {
				size: "md" as MantineSize,
			},
			tooltip: {
				size: "sm" as MantineSize,
			},
		},
		lg: {
			text: {
				size: "sm" as MantineSize,
			},
			tooltip: {
				size: "xs" as MantineSize,
			},
		},
		xl: {
			text: {
				size: "sm" as MantineSize,
			},
			tooltip: {
				size: "xs" as MantineSize,
			},
		},
	};

	return (
		<Tooltip
			label={
				<Text {...props[size]["tooltip"]}>
					{dayjs(date).format("MMMM D, YYYY hh:mm:ss A")}
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
				{...props[size]["text"]}
			>
				{dayjs(date).fromNow()}
			</Text>
		</Tooltip>
	);
};

type SizeProps = { [Size in MantineSize]: { [component: string]: {} } };

const ProjectName: FunctionComponent<{
	name: string;
	size: MantineSize;
	withHref: boolean;
}> = ({ name, size, withHref = false }) => {
	const props = {
		xs: {
			text: {},
		},
		sm: {
			text: {},
		},
		md: {
			text: {
				size: 26 as MantineNumberSize,
			},
		},
		lg: {
			text: {},
		},
		xl: {
			text: {},
		},
	};

	const child = (
		<Text
			component="a"
			weight="bold"
			color="white"
			{...props[size]["text"]}
		>
			{name}
		</Text>
	);

	return withHref ? (
		<Link href={`/projects/${name}`} passHref>
			{child}
		</Link>
	) : (
		child
	);
};

export const ProjectInfo: FunctionComponent<{
	project: Project;
	size?: MantineSize;
	withHref?: boolean;
	disableMenu?: boolean;
}> = ({
	project: { name, status, owner, updatedAt },
	size = "md",
	withHref = false,
	disableMenu = false,
}) => {
	const theme = useMantineTheme();

	const props = {
		xs: {
			group: {
				spacing: "xs" as MantineSize,
			},
			indicator: {
				size: "sm" as MantineSize,
			},
			name: {
				size: "sm" as MantineSize,
			},
			owner: {
				size: "sm" as MantineSize,
			},
			time: {
				size: "sm" as MantineSize,
			},
		},
		sm: {
			group: {
				spacing: "xs" as MantineSize,
			},
			indicator: {
				size: "sm" as MantineSize,
			},
			name: {
				size: "sm" as MantineSize,
			},
			owner: {
				size: "sm" as MantineSize,
			},
			time: {
				size: "sm" as MantineSize,
			},
		},
		md: {
			group: {
				spacing: "sm" as MantineSize,
			},
			indicator: {
				size: "lg" as MantineSize,
			},
			name: {
				size: "md" as MantineSize,
			},
			owner: {
				size: "md" as MantineSize,
			},
			time: {
				size: "md" as MantineSize,
			},
		},
		lg: {
			group: {
				spacing: "sm" as MantineSize,
			},
			indicator: {
				size: "lg" as MantineSize,
			},
			name: {
				size: "md" as MantineSize,
			},
			owner: {
				size: "sm" as MantineSize,
			},
			time: {
				size: "sm" as MantineSize,
			},
		},
		xl: {
			group: {
				spacing: "sm" as MantineSize,
			},
			indicator: {
				size: "lg" as MantineSize,
			},
			name: {
				size: "md" as MantineSize,
			},
			owner: {
				size: "sm" as MantineSize,
			},
			time: {
				size: "sm" as MantineSize,
			},
		},
	};

	return (
		<Stack spacing={4}>
			<Group position="apart">
				<Group align="baseline" {...props[size]["group"]}>
					<ProjectName
						name={name}
						withHref={withHref}
						{...props[size]["name"]}
					/>
					<StatusIndicator
						status={status.value}
						{...props[size]["indicator"]}
					/>
				</Group>

				{!disableMenu && <ProjectActionsMenu />}
			</Group>

			<Group position="apart">
				<Text
					color={theme.colors.dark[0]}
					weight={400}
					{...props[size]["owner"]}
				>
					{owner.username}
				</Text>

				<TimeSince date={updatedAt} {...props[size]["time"]} />
			</Group>
		</Stack>
	);
};
