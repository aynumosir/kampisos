import {
	Box,
	Flex,
	Heading,
	Skeleton,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import type { FC, ReactNode } from "react";

export type DateRangeFilterRootProps = {
	label: ReactNode;
	/** 範囲の始端に付く input の name（例: published_from） */
	fromName: string;
	/** 範囲の終端に付く input の name（例: published_to） */
	toName: string;
	form?: string;
	defaultFrom?: string;
	defaultTo?: string;
};

export const DateRangeFilterRoot: FC<DateRangeFilterRootProps> = (props) => {
	const { label, fromName, toName, form, defaultFrom, defaultTo } = props;

	const t = useTranslations("/components/Filter/DateRangeFilter");

	return (
		<Box asChild>
			<fieldset>
				<Heading asChild size="2" weight="bold" color="gray" mb="3">
					<legend>{label}</legend>
				</Heading>

				<Flex direction="column" gap="1">
					<Flex gap="1" align="center">
						<Text as="label" size="2" color="gray" htmlFor={fromName}>
							{t("from")}
						</Text>
						<TextField.Root
							id={fromName}
							name={fromName}
							form={form}
							type="date"
							defaultValue={defaultFrom}
						/>
					</Flex>

					<Flex gap="1" align="center">
						<Text as="label" size="2" color="gray" htmlFor={toName}>
							{t("to")}
						</Text>
						<TextField.Root
							id={toName}
							name={toName}
							form={form}
							type="date"
							defaultValue={defaultTo}
						/>
					</Flex>
				</Flex>
			</fieldset>
		</Box>
	);
};

// --------------------------------------------------

export const DateRangeFilterSkeleton: FC = () => {
	return (
		<Box>
			<Skeleton>
				<Heading as="h4" size="2" weight="bold" color="gray" mb="3">
					公開日
				</Heading>
			</Skeleton>

			<Flex direction="column" gap="1">
				<Skeleton>
					<TextField.Root type="date" />
				</Skeleton>
				<Skeleton>
					<TextField.Root type="date" />
				</Skeleton>
			</Flex>
		</Box>
	);
};
