"use client";
import "./style.css";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, Heading, Skeleton, Text } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { type FC, type ReactNode, useMemo, useState } from "react";

import { FilterOption } from "./FilterOption";
import type { Option } from "./model";

const MAX_OPTIONS = 5;

export type FilterItemRootProps = {
	label: ReactNode;
	defaultValues?: string[];
	name?: string;
	form?: string;
	options: Option[];
};

export const FilterItemRoot: FC<FilterItemRootProps> = (props) => {
	const { label, defaultValues = [], name, form } = props;

	const t = useTranslations("/components/Filter/FilterItem");
	const [open, setOpen] = useState(false);

	const options = useMemo(() => {
		return props.options.sort((a, b) => {
			const aChecked = defaultValues.includes(a.value);
			const bChecked = defaultValues.includes(b.value);

			if (aChecked !== bChecked) {
				return aChecked ? -1 : 1;
			}
			if (a.count !== b.count) {
				return b.count - a.count;
			}
			return a.value.localeCompare(b.value);
		});
	}, [props.options, defaultValues]);

	const firstOptions = options.slice(0, MAX_OPTIONS);
	const restOptions = options.slice(MAX_OPTIONS);
	const hasMore = props.options.length > MAX_OPTIONS;

	return (
		<Box asChild>
			<fieldset>
				<Heading asChild size="2" weight="bold" color="gray" mb="3">
					<legend>{label}</legend>
				</Heading>

				<Collapsible.Root open={open} onOpenChange={() => setOpen(!open)}>
					<Flex direction="column" gap="1">
						<Flex direction="column" gap="1">
							{firstOptions.map((option) => (
								<FilterOption.Root
									key={option.value}
									name={name}
									form={form}
									option={option}
									defaultChecked={defaultValues.includes(option.value)}
								/>
							))}
						</Flex>

						<Collapsible.Content>
							<Flex direction="column" gap="1">
								{restOptions.map((option) => (
									<FilterOption.Root
										key={option.value}
										name={name}
										form={form}
										option={option}
										defaultChecked={defaultValues.includes(option.value)}
									/>
								))}
							</Flex>
						</Collapsible.Content>
					</Flex>

					{hasMore && (
						<Collapsible.Trigger asChild>
							<Flex asChild justify="between" width="100%" mt="2">
								<Button variant="ghost" color="gray">
									{open ? (
										<>
											<Text>{t("collapse")}</Text>
											<ChevronUpIcon aria-hidden="true" />
										</>
									) : (
										<>
											<Text>{t("expand")}</Text>
											<ChevronDownIcon aria-hidden="true" />
										</>
									)}
								</Button>
							</Flex>
						</Collapsible.Trigger>
					)}
				</Collapsible.Root>
			</fieldset>
		</Box>
	);
};

// --------------------------------------------------

export const FilterItemSkeleton: FC = () => {
	return (
		<Box>
			<Skeleton>
				<Heading as="h4" size="2" weight="bold" color="gray" mb="3">
					出典
				</Heading>
			</Skeleton>

			<Flex direction="column" gap="1">
				{[...Array(5)].map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: 並び替えが起こらないため
					<FilterOption.Skeleton key={i} />
				))}
			</Flex>
		</Box>
	);
};
