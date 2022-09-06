import { Anchor, Breadcrumbs } from "@mantine/core";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

export const PageBreadcrumb: FunctionComponent = () => {
	const router = useRouter();
	const parts = router.asPath.substring(1).split("/");

	let crumbs = [];
	let path = "";

	for (let i = 0; i < parts.length; i++) {
		path += "/" + parts[i];
		crumbs.push({ path, name: parts[i] });
	}

	return (
		<Breadcrumbs>
			{crumbs.map(({ path, name }) => (
				<Anchor href={path} key={path}>
					{name}
				</Anchor>
			))}
		</Breadcrumbs>
	);
};
