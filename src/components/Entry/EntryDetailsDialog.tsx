"use client";

import { CopyIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
	Button,
	Code,
	DataList,
	Dialog,
	Flex,
	IconButton,
	Link,
	Text,
	Tooltip,
} from "@radix-ui/themes";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import { type FC, useCallback } from "react";
import { useDialectFormatter } from "@/hooks/useDialectFormatter";
import { getMostDetailedDialects } from "@/utils/getMostDetailedDialects";
import { formatDateOrRange } from "@/utils/timestamp";
import { toHref } from "@/utils/uri";
import { Breadcrumb } from "../Breadcrumb";

type DialectListProps = {
	dialectLv1: string[] | null;
	dialectLv2: string[] | null;
	dialectLv3: string[] | null;
};
const DialectList: FC<DialectListProps> = (props) => {
	const { dialectLv1, dialectLv2, dialectLv3 } = props;

	const formatDialect = useDialectFormatter();

	const hasDialect = !!(dialectLv1 || dialectLv2 || dialectLv3);
	if (!hasDialect) {
		return <NoData />;
	}

	const mostDetailedDialects = getMostDetailedDialects(
		dialectLv1 ?? [],
		dialectLv2 ?? [],
		dialectLv3 ?? [],
	);

	// TODO: refactor me
	const valuesList = mostDetailedDialects.map(
		(mostDetailedDialect): string[] => {
			const count = mostDetailedDialect.split("/").length;

			return Array.from({ length: count }, (_, k) => {
				const kthDialectSegment = mostDetailedDialect
					.split("/")
					.slice(0, k + 1)
					.join("/");
				return formatDialect(kthDialectSegment);
			});
		},
	);

	return (
		<Flex gap="1" direction="column">
			{valuesList.map((values) => (
				<Breadcrumb key={values.join()} values={values} />
			))}
		</Flex>
	);
};

const NoData: FC = () => {
	const t = useTranslations("/components/Entry/EntryDetailsDialog");
	return <Text color="gray">{t("no_data")}</Text>;
};

export type EntryDetailsDialogProps = {
	objectID: string;
	document: string;
	collectionLv1: string | null;
	collectionLv2: string | null;
	collectionLv3: string | null;
	author: string | null;
	dialectLv1: string[] | null;
	dialectLv2: string[] | null;
	dialectLv3: string[] | null;
	uri: string | null;
	recordedAt: string | null;
	publishedAt: string | null;
};

export const EntryDetailsDialog: FC<EntryDetailsDialogProps> = (props) => {
	const {
		objectID,
		collectionLv1,
		collectionLv2,
		collectionLv3,
		document,
		author,
		uri,
		dialectLv1,
		dialectLv2,
		dialectLv3,
		recordedAt,
		publishedAt,
	} = props;

	const locale = useLocale();
	const t = useTranslations("/components/Entry/EntryDetailsDialog");
	const href = uri ? toHref(uri) : null;

	dayjs.locale(locale);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(objectID);
		window.alert(t("copied", { content: objectID }));
	}, [objectID, t]);

	return (
		<Dialog.Root>
			<Tooltip content={t("title")}>
				<Dialog.Trigger>
					<IconButton variant="ghost" color="gray">
						<DotsHorizontalIcon aria-label={t("title")} />
					</IconButton>
				</Dialog.Trigger>
			</Tooltip>

			<Dialog.Content className="entry-details-dialog">
				{/** biome-ignore lint/a11y/noNoninteractiveTabindex: フォーカスを安全に移動させるため */}
				<div tabIndex={0} />

				<Dialog.Title>{t("title")}</Dialog.Title>
				<Dialog.Description size="2" mb="4">
					{t("description")}
				</Dialog.Description>

				<DataList.Root mb="4">
					<DataList.Item>
						<DataList.Label>ID</DataList.Label>
						<DataList.Value>
							<Flex gap="2">
								<Code variant="ghost">{objectID}</Code>

								<Tooltip content={t("copy_id")}>
									<IconButton variant="ghost" color="gray" onClick={handleCopy}>
										<CopyIcon />
									</IconButton>
								</Tooltip>
							</Flex>
						</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>{t("collection")}</DataList.Label>
						<DataList.Value>
							{collectionLv3 || collectionLv2 || collectionLv1 ? (
								<Breadcrumb
									values={
										collectionLv3?.split("/") ??
										collectionLv2?.split("/") ??
										// biome-ignore lint/suspicious/noNonNullAssertedOptionalChain: ainu-corpora側で検証済み
										// biome-ignore lint/style/noNonNullAssertion: ainu-corpora側で検証済み
										collectionLv1?.split("/")!
									}
								/>
							) : (
								<NoData />
							)}
						</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>{t("document")}</DataList.Label>
						<DataList.Value>{document}</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>{t("author")}</DataList.Label>
						<DataList.Value>{author ?? <NoData />}</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>{t("dialect")}</DataList.Label>
						<DataList.Value>
							<DialectList
								dialectLv1={dialectLv1}
								dialectLv2={dialectLv2}
								dialectLv3={dialectLv3}
							/>
						</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>{t("recorded_at")}</DataList.Label>
						<DataList.Value>
							{recordedAt ? formatDateOrRange(recordedAt, "LL") : <NoData />}
						</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>{t("published_at")}</DataList.Label>
						<DataList.Value>
							{publishedAt ? formatDateOrRange(publishedAt, "LL") : <NoData />}
						</DataList.Value>
					</DataList.Item>

					<DataList.Item>
						<DataList.Label>URI</DataList.Label>
						<DataList.Value>
							{href && (
								<Link href={href} target="_blank" rel="noreferrer">
									{uri}
								</Link>
							)}
						</DataList.Value>
					</DataList.Item>
				</DataList.Root>

				<Flex justify="end">
					<Dialog.Close>
						<Button color="gray" variant="soft">
							{t("close")}
						</Button>
					</Dialog.Close>
				</Flex>
			</Dialog.Content>
		</Dialog.Root>
	);
};
