import { createFileRoute } from "@tanstack/react-router";
import Home from "../lab/bento/Home";

export const Route = createFileRoute("/bento/")({ component: Home });
