import { createFileRoute } from "@tanstack/react-router";
import Home from "../lab/editorial/Home";

export const Route = createFileRoute("/editorial/")({ component: Home });
