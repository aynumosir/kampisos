import { Badge, Flex, Text, type TextProps } from "@radix-ui/themes";
import { useLocale, useTranslations } from "next-intl";
import type { FC } from "react";

import dayjs from "@/lib/dayjs";

import type * as t from "../../models/changelog";

type ChangelogsItemCategoryProps = {
	category: t.Changelog.Category;
};

const ChangelogsItemCategory = (props: ChangelogsItemCategoryProps) => {
	const t = useTranslations("/components/Changelogs/ChangelogsItem");

	const { category } = props;
	switch (category) {
		case "content":
			return <Badge color="teal">{t("content")}</Badge>;
		case "feature":
			return <Badge color="tomato">{t("feature")}</Badge>;
		case "chore":
			return <Badge color="gray">{t("chore")}</Badge>;
	}
};

type ChangelogsItemContentProps = {
	changelog: t.Changelog;
};

const ChangelogsItemContent = (props: ChangelogsItemContentProps) => {
	const { changelog } = props;

	const locale = useLocale();
	if (locale === "ain-Latn") {
		return changelog.contentAinLatn;
	}

	if (locale === "ain-Kana") {
		return changelog.contentAinKana;
	}

	return changelog.content;
};

//------

export type ChangelogsItemProps = {
	className?: string;
	changelog: t.Changelog;
	textProps?: TextProps;
};

export const ChangelogsItem: FC<ChangelogsItemProps> = (props) => {
	const { changelog, className, textProps = {} } = props;

	const locale = useLocale();
	dayjs.locale(locale);

	const publishedAt = dayjs(changelog.publishedAt);

	return (
		<Flex direction="column" gap="2" className={className}>
			<Flex gap="3" align="center">
				<ChangelogsItemCategory category={changelog.categories[0]} />

				<Text color="gray" size="2">
					<time dateTime={changelog.publishedAt}>{publishedAt.fromNow()}</time>
				</Text>
			</Flex>

			<Text as="p" {...textProps}>
				<ChangelogsItemContent changelog={changelog} />
			</Text>
		</Flex>
	);
};
