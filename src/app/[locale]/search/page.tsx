import {
	Box,
	Card,
	Container,
	Flex,
	Heading,
	Section,
	Text,
} from "@radix-ui/themes";
import { to_kana } from "ainu-utils";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { Filter } from "@/components/Filter";
import { Search } from "@/components/Search";
import { client } from "@/lib/elasticsearch";
import { buildSearchRequest } from "@/lib/elasticsearch-helper";
import type { EntryAggregate, EntryHit } from "@/models/entry";
import { toArraySearchParam } from "@/utils/toArraySearchParams";
import { toSingleSearchParam } from "@/utils/toSingleSearchParam";

import { FooterContent } from "./FooterContent";
import { MobileFilterButton } from "./MobileFilterButton";
import { Result } from "./Result";
import { SearchStats } from "./SearchStats";

export const revalidate = 86_400;

const SIZE = 20;

const isLatin = (str: string) => /^[a-zA-Z0-9\s]+$/.test(str);

export async function generateMetadata(
	props: PageProps<"/[locale]/search">,
): Promise<Metadata> {
	const t = await getTranslations("/app/[locale]/search/page");
	const searchParams = await props.searchParams;

	const query =
		typeof searchParams.q === "string" ? searchParams.q.trim() : undefined;
	if (!query) {
		redirect("/");
	}

	const page = Number(searchParams.page ?? 0);

	const createTitle = (query: string, page: number): string => {
		if (isLatin(query)) {
			if (page === 0) {
				return t("title_with_kana", { query, kana: to_kana(query) });
			} else {
				return t("title_with_kana_and_page_num", {
					query,
					kana: to_kana(query),
					page: page + 1,
				});
			}
		} else {
			if (page === 0) {
				return t("title", { query });
			} else {
				return t("title_with_page_num", { query, page: page + 1 });
			}
		}
	};

	const title = createTitle(query, page);
	const description = t("description", { query });

	return {
		title,
		description,
		robots: {
			index: page === 0,
			follow: true,
		},
		openGraph: {
			title,
			description,
			images: "/cover.png",
		},
		twitter: {
			card: "summary",
		},
		alternates: {
			canonical: `/search?q=${encodeURIComponent(query)}`,
		},
	};
}

export default async function SearchPage(props: PageProps<"/[locale]/search">) {
	const searchParams = await props.searchParams;
	const t = await getTranslations("/app/[locale]/search/page");

	const query =
		typeof searchParams.q === "string" ? searchParams.q.trim() : undefined;
	const page = Number(searchParams.page ?? 0);
	const dialectLv1 = toArraySearchParam(searchParams.dialect_lv1);
	const dialectLv2 = toArraySearchParam(searchParams.dialect_lv2);
	const dialectLv3 = toArraySearchParam(searchParams.dialect_lv3);
	const author = toArraySearchParam(searchParams.author);
	const collectionLv1 = toArraySearchParam(searchParams.collection_lv1);
	const pronoun = toArraySearchParam(searchParams.pronoun);

	const publishedFrom = toSingleSearchParam(searchParams.published_from);
	const publishedTo = toSingleSearchParam(searchParams.published_to);
	const recordedFrom = toSingleSearchParam(searchParams.recorded_from);
	const recordedTo = toSingleSearchParam(searchParams.recorded_to);

	if (!query) {
		notFound();
	}

	const request = buildSearchRequest({
		query,
		size: SIZE,
		page,
		filters: {
			dialect_lv1: dialectLv1,
			dialect_lv2: dialectLv2,
			dialect_lv3: dialectLv3,
			collection_lv1: collectionLv1,
			author,
			pronoun,
		},
		dateRanges: {
			published_at: { from: publishedFrom, to: publishedTo },
			recorded_at: { from: recordedFrom, to: recordedTo },
		},
	});

	const searchResponsePromise = client.search<EntryHit, EntryAggregate>(
		request,
	);

	return (
		<Container asChild m="3" size="4">
			<main aria-labelledby="search-heading search-stats">
				{/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: https://w3c.github.io/aria/#aria-labelledby */}
				<header aria-labelledby="search-heading">
					<Section size="2">
						<Flex direction="column" gap="2" align="center">
							<Heading
								id="search-heading"
								as="h2"
								size={{ initial: "8", sm: "9" }}
							>
								{query}
							</Heading>
							<Text asChild align="center" color="gray">
								<p>{t("subtitle")}</p>
							</Text>
							<Box
								width={{
									initial: "100%",
									sm: "36rem",
								}}
							>
								<Search defaultValue={query} />
							</Box>
						</Flex>
					</Section>
				</header>
				<Flex gap="3">
					<Box
						asChild
						width="18rem"
						display={{ initial: "none", md: "block" }}
						flexGrow="0"
						flexShrink="0"
						style={{
							height: "min-content",
							position: "sticky",
							top: "var(--space-3)",
						}}
					>
						<Card asChild size="2">
							<aside aria-labelledby="search-complementary-heading">
								<Heading
									id="search-complementary-heading"
									as="h3"
									size="4"
									mb="4"
								>
									{t("filter")}
								</Heading>
								<Suspense fallback={<Filter.Skeleton />} key={query}>
									<Filter.Root
										searchResponsePromise={searchResponsePromise}
										defaultValues={{
											dialectLv1,
											dialectLv2,
											dialectLv3,
											author,
											collectionLv1,
											pronoun,
											publishedFrom,
											publishedTo,
											recordedFrom,
											recordedTo,
										}}
									/>
								</Suspense>
							</aside>
						</Card>
					</Box>
					<Box asChild flexGrow="1">
						<Card asChild size="2">
							<article aria-labelledby="search-stats">
								<header>
									<Suspense fallback={<SearchStats.Skeleton />} key={query}>
										<SearchStats.Root
											query={query}
											id="search-stats"
											searchResponsePromise={searchResponsePromise}
											suffix={
												<Box asChild display={{ initial: "block", md: "none" }}>
													<MobileFilterButton
														defaultValues={{
															dialectLv1,
															dialectLv2,
															dialectLv3,
															author,
															collectionLv1,
															pronoun,
															publishedFrom,
															publishedTo,
															recordedFrom,
															recordedTo,
														}}
														searchResponsePromise={searchResponsePromise}
													/>
												</Box>
											}
										/>
									</Suspense>
								</header>

								<Box mt="3">
									<Suspense fallback={<Result.Skeleton />} key={query}>
										<Result.Root
											searchResponsePromise={searchResponsePromise}
										/>
									</Suspense>
								</Box>

								<Suspense fallback={null} key={query}>
									<FooterContent
										size={SIZE}
										page={page}
										searchResponsePromise={searchResponsePromise}
									/>
								</Suspense>
							</article>
						</Card>
					</Box>
				</Flex>
			</main>
		</Container>
	);
}
