import { useEffect, useRef } from "react";

// Dev falls back to Cloudflare's always-pass test key so the flow works locally without setup.
export const TURNSTILE_SITE_KEY: string =
	import.meta.env.VITE_TURNSTILE_SITE_KEY || (import.meta.env.DEV ? "1x00000000000000000000AA" : "");

type TurnstileApi = {
	render: (el: HTMLElement, opts: Record<string, unknown>) => string;
	reset: (id: string) => void;
	remove: (id: string) => void;
};
declare global {
	interface Window {
		turnstile?: TurnstileApi;
	}
}

let loading: Promise<void> | null = null;
const loadScript = () =>
	(loading ??= new Promise<void>((resolve, reject) => {
		const s = document.createElement("script");
		s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
		s.async = true;
		s.onload = () => resolve();
		s.onerror = () => {
			loading = null;
			reject(new Error("turnstile failed to load"));
		};
		document.head.appendChild(s);
	}));

/**
 * Cloudflare Turnstile. Invisible for most visitors ("interaction-only"); only shows a
 * checkbox when Cloudflare is unsure. Tokens are single-use: bump `resetKey` after each submit.
 */
export const Turnstile = ({
	onToken,
	onError,
	resetKey,
	lang,
}: {
	onToken: (token: string) => void;
	/** the check could not run (script blocked, challenge failed…) — show the visitor a way out */
	onError: () => void;
	resetKey: number;
	lang: string;
}) => {
	const el = useRef<HTMLDivElement>(null);
	const id = useRef<string>();

	useEffect(() => {
		if (!TURNSTILE_SITE_KEY) return;
		let cancelled = false;
		loadScript()
			.then(() => {
				if (cancelled || !el.current || !window.turnstile) return;
				id.current = window.turnstile.render(el.current, {
					sitekey: TURNSTILE_SITE_KEY,
					theme: "dark",
					language: lang,
					appearance: "interaction-only",
					callback: onToken,
					"expired-callback": () => onToken(""),
					"error-callback": () => {
						onToken("");
						onError();
					},
				});
			})
			.catch(() => {
				onToken("");
				onError();
			});
		return () => {
			cancelled = true;
			if (id.current) window.turnstile?.remove(id.current);
			id.current = undefined;
			onToken("");
		};
	}, [lang, onToken, onError]);

	useEffect(() => {
		if (!resetKey || !id.current) return;
		onToken("");
		window.turnstile?.reset(id.current);
	}, [resetKey, onToken]);

	return <div ref={el} />;
};
