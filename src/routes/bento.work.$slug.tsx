import { createFileRoute } from "@tanstack/react-router";
import Project from "../lab/bento/Project";

export const Route = createFileRoute("/bento/work/$slug")({ component: Project });
