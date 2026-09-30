import { Navigate, createRootRoute } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import Layout from "../site/Layout";

export const Route = createRootRoute({
	component: () => (
		<>
			<Layout />
			<Analytics />
		</>
	),
	// Old links (/v2, /ignite, …) and typos land on the home page instead of a blank 404.
	notFoundComponent: () => <Navigate to='/' replace />,
});
