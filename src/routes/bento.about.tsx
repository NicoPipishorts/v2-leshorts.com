import { createFileRoute } from "@tanstack/react-router";
import About from "../lab/bento/About";

export const Route = createFileRoute("/bento/about")({ component: About });
