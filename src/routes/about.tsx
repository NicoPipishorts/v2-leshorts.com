import { createFileRoute } from "@tanstack/react-router";
import About from "../site/About";

export const Route = createFileRoute("/about")({ component: About });
