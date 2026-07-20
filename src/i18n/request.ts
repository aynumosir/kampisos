// https://next-intl.dev/docs/routing/setup

import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { deepMerge } from "@/utils/deepMerge";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
	// Typically corresponds to the `[locale]` segment
	const requested = await requestLocale;
	const locale = hasLocale(routing.locales, requested)
		? requested
		: routing.defaultLocale;

	const messages = (await import(`../../messages/${locale}.json`)).default;
	const defaultMessages = (
		await import(`../../messages/${routing.defaultLocale}.json`)
	).default;

	return {
		locale,
		messages: deepMerge(defaultMessages, messages),
	};
});
