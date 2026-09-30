import { createFileRoute } from "@tanstack/react-router";
import Project from "../site/Project";

export const Route = createFileRoute("/work/$slug")({ component: Project });
