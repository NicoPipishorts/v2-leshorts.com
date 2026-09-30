import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const OG_LOCALE: Record<string, string> = {
	en: "en_US",
	fr: "fr_FR",
};

const setMeta = (
	selector: string,
	attribute: "name" | "property",
	key: string,
	content: string,
) => {
	let element = document.head.querySelector<HTMLMetaElement>(selector);
	if (!element) {
		element = document.createElement("meta");
		element.setAttribute(attribute, key);
		document.head.appendChild(element);
	}
	element.setAttribute("content", content);
};

/**
 * Keeps `<html lang>` and the SEO / link-preview tags in sync with the active
 * language. Without this the French page still announced itself as English to
 * screen readers, translation tools and anything unfurling the URL.
 */
const ORIGIN = "https://www.nicolaspisar.com";

export type PageMeta = { title?: string; description?: string; path?: string };

export const useDocumentMeta = (page: PageMeta = {}) => {
	const { t, i18n } = useTranslation();
	const language =
		i18n.resolvedLanguage?.startsWith("fr") || i18n.language?.startsWith("fr")
			? "fr"
			: "en";

	const title = page.title ?? t("seo.title");
	const description = page.description ?? t("seo.description");
	const url = ORIGIN + (page.path ?? "/");

	useEffect(() => {
		let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
		if (!canonical) {
			canonical = document.createElement("link");
			canonical.rel = "canonical";
			document.head.appendChild(canonical);
		}
		canonical.href = url;
		setMeta('meta[property="og:url"]', "property", "og:url", url);

		document.documentElement.lang = language;
		document.title = title;

		setMeta('meta[name="description"]', "name", "description", description);
		setMeta('meta[property="og:title"]', "property", "og:title", title);
		setMeta(
			'meta[property="og:description"]',
			"property",
			"og:description",
			description,
		);
		setMeta(
			'meta[property="og:locale"]',
			"property",
			"og:locale",
			OG_LOCALE[language] ?? OG_LOCALE.en,
		);
		setMeta(
			'meta[property="og:image:alt"]',
			"property",
			"og:image:alt",
			t("seo.imageAlt"),
		);
		setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
		setMeta(
			'meta[name="twitter:description"]',
			"name",
			"twitter:description",
			description,
		);
	}, [language, t, title, description, url]);
};
