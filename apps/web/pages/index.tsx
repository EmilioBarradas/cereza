import { Button } from "@mantine/core";
import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
    const projects = trpc.useQuery(["getProjects"]);

    if (projects.isLoading) {
        return <>Loading...</>;
    }

    return (
        <>
            {projects.data?.map((project) => (
                <div key={project.name}>
                    <Link href={`/project/${project.name}`} passHref>
                        <Button>{project.name}</Button>
                    </Link>
                </div>
            ))}
        </>
    );
};

export default Home;
