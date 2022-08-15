import { Text } from "@mantine/core";
import { BuildRequest } from "@prisma/client";
import debounce from "debounce";
import { GetServerSideProps, NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { trpc, trpcClient } from "../../../../utils/trpc";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const { projectId, buildId } = query;

    if (typeof projectId !== "string" || typeof buildId !== "string")
        return { notFound: true };

    const build = await trpcClient.query("getBuild", buildId);

    if (build === undefined) return { notFound: true };

    return {
        props: {
            build,
        },
    };
};

const useDebounce = <T extends any>(value: T, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const Build: NextPage<{ build: BuildRequest }> = ({ build }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const debouncedLogs = useDebounce(logs, 200);

    trpc.useSubscription(["onBuildLog", build.id], {
        onNext: (data) => {
            setLogs((curLogs) => [...curLogs, JSON.stringify(data)]);
        },
    });

    if (debouncedLogs.length === 0) return <>Loading...</>;

    return (
        <>
            {debouncedLogs.map((log, i) => (
                <Text key={i}>{log}</Text>
            ))}
        </>
    );
};

export default Build;
