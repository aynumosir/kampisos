import "@radix-ui/themes/styles.css";
import "./globals.css";

import { GoogleAnalytics } from "@next/third-parties/google";
import { Grid, Theme } from "@radix-ui/themes";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { clsx } from "clsx";
import type { Metadata } from "next";
import { Cookie, Roboto, Roboto_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Banner } from "@/components/Banner";
import { ContentInfo } from "@/components/ContentInfo";
import { routing } from "@/i18n/routing";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["300", "400", "500"],
	variable: "--font-roboto",
});

const robotoMono = Roboto_Mono({
	subsets: ["latin"],
	weight: ["300", "400", "500"],
	variable: "--font-roboto-mono",
});

const cookie = Cookie({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-cookie",
});

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({
		locale,
		namespace: "/app/[locale]/layout",
	});

	return {
		metadataBase: new URL("https://kampisos.aynu.io"),
		title: {
			default: t("title"),
			template: `%s | ${t("title")}`,
		},
		description: t("description"),
		robots: {
			index: true,
			follow: false,
		},
		openGraph: {
			title: t("title"),
			description: t("description"),
			images: "/cover.png",
		},
		icons: [
			{
				url: "/icon+light.svg",
				type: "image/svg+xml",
				media: "(prefers-color-scheme: light)",
			},
			{
				url: "/icon+dark.svg",
				type: "image/svg+xml",
				media: "(prefers-color-scheme: dark)",
			},
		],
	};
}

export default async function RootLayout(props: LayoutProps<"/[locale]">) {
	const { children, params } = props;
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);

	return (
		<html
			lang={locale}
			className={clsx(roboto.variable, robotoMono.variable, cookie.variable)}
			// https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
			suppressHydrationWarning
		>
			<body>
				<NextIntlClientProvider>
					<ThemeProvider attribute="class">
						<Theme accentColor="teal" grayColor="sand">
							<Grid
								className="gradient"
								columns="100%"
								rows="auto 1fr auto"
								minHeight="100vh"
							>
								<Banner />
								{children}
								<ContentInfo />
							</Grid>
						</Theme>
					</ThemeProvider>
				</NextIntlClientProvider>

				<GoogleAnalytics gaId="G-RK31448XYB" />
				<SpeedInsights />
			</body>
		</html>
	);
}
