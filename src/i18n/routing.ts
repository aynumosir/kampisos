// https://next-intl.dev/docs/routing/setup
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["ja", "ain-Latn", "ain-Kana"],
	defaultLocale: "ja",

	// https://next-intl.dev/docs/routing/configuration#locale-cookie
	localeCookie: {
		maxAge: 60 * 60 * 24 * 365,
	},
});
