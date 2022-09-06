import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({
	resolvedUrl,
}) => {
	return {
		redirect: {
			destination: `${resolvedUrl}/process`,
			permanent: true,
		},
	};
};

export const NoopPage = () => {
	return null;
};

export default NoopPage;
