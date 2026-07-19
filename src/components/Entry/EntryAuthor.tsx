import { Text, VisuallyHidden } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { useDialectFormatter } from "@/hooks/useDialectFormatter";
import { getMostDetailedDialects } from "@/utils/getMostDetailedDialects";

type EntryAuthorProps = {
	author: string | null;
	dialectLv1: string[] | null;
	dialectLv2: string[] | null;
	dialectLv3: string[] | null;
};

export const EntryAuthor: FC<EntryAuthorProps> = (props) => {
	const { author, dialectLv1, dialectLv2, dialectLv3 } = props;

	const t = useTranslations("/components/Entry/EntryAuthor");
	const formatDialect = useDialectFormatter();

	const dialects = getMostDetailedDialects(
		dialectLv1 ?? [],
		dialectLv2 ?? [],
		dialectLv3 ?? [],
	);
	const formattedDialects =
		dialects.length > 0
			? dialects.map((dialect) => formatDialect(dialect)).join(", ")
			: null;

	if (author && formattedDialects) {
		return (
			<Text color="gray" size="2">
				{t.rich("author_with_dialect", {
					author,
					dialect: formattedDialects,
					vh: (chunks) => <VisuallyHidden>{chunks}</VisuallyHidden>,
				})}
			</Text>
		);
	}

	if (author) {
		return (
			<Text color="gray" size="2">
				{t.rich("author", {
					author,
					vh: (chunks) => <VisuallyHidden>{chunks}</VisuallyHidden>,
				})}
			</Text>
		);
	}

	if (formattedDialects) {
		return (
			<Text color="gray" size="2">
				{t.rich("dialect", {
					dialect: formattedDialects,
					vh: (chunks) => <VisuallyHidden>{chunks}</VisuallyHidden>,
				})}
			</Text>
		);
	}

	return null;
};
