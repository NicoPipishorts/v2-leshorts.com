import { createFileRoute } from "@tanstack/react-router";
import CvV2 from "../components/v2/CvV2";

export const Route = createFileRoute("/v2")({
	component: CvV2,
});
