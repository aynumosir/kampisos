"use client";

import {
	ChevronLeftIcon,
	ChevronRightIcon,
	DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
	Button,
	Flex,
	IconButton,
	Reset,
	VisuallyHidden,
} from "@radix-ui/themes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { createPages } from "@/utils/pages";

export type PaginatorProps = {
	page: number;
	totalPages: number;
	maxPages?: number;
};

const DEFAULT_MAX_PAGES_TO_SHOW = 5;

export function Paginator(props: PaginatorProps) {
	const { page, totalPages, maxPages = DEFAULT_MAX_PAGES_TO_SHOW } = props;
	const pages = createPages(page, totalPages, maxPages);

	const pathname = usePathname();
	const searchParams = useSearchParams();
	const t = useTranslations("/components/Paginator/Paginator");

	const createHref = (page: number): string => {
		if (page < 0) {
			return "";
		}
		const params = new URLSearchParams(searchParams);
		params.set("page", String(page));
		return `${pathname}?${params.toString()}`;
	};

	return (
		<nav aria-label={t("title")}>
			<Reset>
				<Flex gap="1" asChild justify="center">
					<ul>
						{page > 0 && (
							<li>
								<IconButton asChild variant="outline" size="3">
									<Link href={createHref(page - 1)} rel="prev">
										<ChevronLeftIcon aria-label={t("prev")} />
									</Link>
								</IconButton>
							</li>
						)}

						{pages.hasMore.leading && (
							<Flex justify="center" align="center" asChild p="1">
								<li>
									<DotsHorizontalIcon color="gray" />
								</li>
							</Flex>
						)}

						{pages.value.map((value) => {
							const current = value === page;
							const lastPage = value === totalPages - 1;
							const label = lastPage
								? t.rich("nth_last", {
										n: value + 1,
										vh: (chunks) => <VisuallyHidden>{chunks}</VisuallyHidden>,
									})
								: t.rich("nth", {
										n: value + 1,
										vh: (chunks) => <VisuallyHidden>{chunks}</VisuallyHidden>,
									});

							return (
								<li key={value}>
									<Button
										asChild
										variant={current ? "solid" : "outline"}
										size="3"
									>
										<Link href={createHref(value)}>{label}</Link>
									</Button>
								</li>
							);
						})}

						{pages.hasMore.trailing && (
							<Flex justify="center" align="center" asChild p="1">
								<li>
									<DotsHorizontalIcon aira-hidden="true" color="gray" />
								</li>
							</Flex>
						)}

						{page < totalPages - 1 && (
							<li>
								<IconButton asChild variant="outline" size="3">
									<Link href={createHref(page + 1)} rel="next">
										<ChevronRightIcon aria-label={t("next")} />
									</Link>
								</IconButton>
							</li>
						)}
					</ul>
				</Flex>
			</Reset>
		</nav>
	);
}
