import { createFileRoute } from "@tanstack/react-router";
import Home from "../site/Home";

export const Route = createFileRoute("/")({ component: Home });
