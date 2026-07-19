import { Card, Flex, Heading, Separator } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { type FC, Fragment } from "react";

import type * as t from "@/models/changelog";

import { ChangelogsItem } from "./ChangelogsItem";

type ChangelogsProps = {
	className?: string;
	changelogs: t.Changelog[];
};

export const Changelogs: FC<ChangelogsProps> = (props) => {
	const { className, changelogs } = props;

	const t = useTranslations("/components/Changelogs/Changelogs");

	return (
		<Card className={className} size="2">
			<Heading as="h2" size="4" weight="bold">
				{t("title")}
			</Heading>

			<Flex direction="column" gap="3" mt="4">
				{changelogs.map((changelog, i) => (
					<Fragment key={changelog.content}>
						<ChangelogsItem
							changelog={changelog}
							textProps={i === 0 ? { size: "5" } : undefined}
						/>

						{i !== changelogs.length - 1 && <Separator size="4" decorative />}
					</Fragment>
				))}
			</Flex>
		</Card>
	);
};
