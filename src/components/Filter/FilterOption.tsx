import {
	Badge,
	Checkbox,
	Flex,
	Skeleton,
	Text,
	VisuallyHidden,
} from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import type { FC } from "react";

import type { Option } from "./model";

type FilterOptionRootProps = {
	name?: string;
	form?: string;
	option: Option;
	defaultChecked?: boolean;
};

const FilterOptionRoot: FC<FilterOptionRootProps> = (props) => {
	const { name, form, option, defaultChecked } = props;

	const t = useTranslations("/components/Filter/FilterOption");
	const label = option.label ?? option.value;
	const count = Intl.NumberFormat("ja-JP").format(option.count);

	return (
		<Flex gap="1" align="center" asChild>
			<Text as="label">
				<Checkbox
					name={name}
					form={form}
					value={option.value}
					defaultChecked={defaultChecked}
					variant="surface"
				/>

				<Flex
					flexGrow="1"
					gap="1"
					justify="between"
					align="center"
					minWidth="0"
				>
					<Text truncate>{label}</Text>
					<Badge variant="soft" color="gray">
						{t.rich("count", {
							count,
							vh: (chunks) => <VisuallyHidden>{chunks}</VisuallyHidden>,
						})}
					</Badge>
				</Flex>
			</Text>
		</Flex>
	);
};

// ------------------------------

const FilterOptionSkeleton: FC = () => {
	return (
		<Flex gap="1" align="center">
			<Skeleton>
				<Checkbox variant="surface" />
			</Skeleton>

			<Flex flexGrow="1" gap="1" justify="between" align="center">
				<Skeleton>
					<Text>アイヌ語アーカイブ</Text>
				</Skeleton>

				<Skeleton>
					<Badge variant="soft" color="gray">
						123
					</Badge>
				</Skeleton>
			</Flex>
		</Flex>
	);
};

// ------------------------------

export const FilterOption = {
	Root: FilterOptionRoot,
	Skeleton: FilterOptionSkeleton,
};
