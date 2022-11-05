import { trpc } from "@/utils/trpc";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWSClient, wsLink } from "@trpc/client";
import WebSocket from "isomorphic-ws";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				wsLink({
					client: createWSClient({
						url: `ws://localhost:59213/`,
						WebSocket: WebSocket as any,
					}),
				}),
			],
		})
	);

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					colorScheme: "dark",
				}}
			>
				<trpc.Provider client={trpcClient} queryClient={queryClient}>
					<QueryClientProvider client={queryClient}>
						<Component {...pageProps} />
					</QueryClientProvider>
				</trpc.Provider>
			</MantineProvider>
		</>
	);
};

export default MyApp;
