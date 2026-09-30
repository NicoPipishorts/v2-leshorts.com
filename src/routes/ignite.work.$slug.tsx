import { createFileRoute } from "@tanstack/react-router";
import Project from "../lab/ignite/Project";

export const Route = createFileRoute("/ignite/work/$slug")({ component: Project });
