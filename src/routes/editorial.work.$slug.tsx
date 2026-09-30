import { createFileRoute } from "@tanstack/react-router";
import Project from "../lab/editorial/Project";

export const Route = createFileRoute("/editorial/work/$slug")({ component: Project });
