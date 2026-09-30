import { createFileRoute } from "@tanstack/react-router";
import Contact from "../site/Contact";

export const Route = createFileRoute("/contact")({ component: Contact });
