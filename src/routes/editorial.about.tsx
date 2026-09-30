import { createFileRoute } from "@tanstack/react-router";
import About from "../lab/editorial/About";

export const Route = createFileRoute("/editorial/about")({ component: About });
