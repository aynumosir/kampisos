import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import {
	Box,
	Checkbox,
	Flex,
	IconButton,
	Skeleton,
	Text,
} from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { type FC, type ReactNode, useState } from "react";

import { DialectSelectorCheckbox } from "./DialectSelectorCheckbox";
import {
	DialectSelectorProvider,
	useDialectSelector,
} from "./DialectSelectorContext";

export type DialectSelectorItemProps = {
	label: string;
	name: string;
	value: string;
	count?: number;
	form?: string;
	defaultChecked?: boolean;
	children?: ReactNode;
};

const DialectSelectorItemRoot: FC<DialectSelectorItemProps> = (props) => {
	const { label, name, value, form, count, defaultChecked, children } = props;

	const t = useTranslations("/components/DialectSelector/DialectSelectorItem");
	const dialectSelector = useDialectSelector();
	const [open, setOpen] = useState(false);
	const [checked, setChecked] = useState(defaultChecked);
	const [checkedDescendantsCount, setCheckedDescendantsCount] = useState(0);

	const handleChange = (checked: boolean) => {
		setChecked(checked);
		dialectSelector.onChange?.(checked);
	};

	const handleChangeDescendant = (checked: boolean) => {
		if (checked) {
			setCheckedDescendantsCount((prev) => prev + 1);
		} else {
			setCheckedDescendantsCount((prev) => prev - 1);
		}
		dialectSelector.onChange?.(checked);
	};

	if (children == null) {
		return (
			<Box pl="4">
				<DialectSelectorCheckbox
					name={name}
					value={value}
					checked={checked || dialectSelector.ancestorChecked}
					disabled={dialectSelector.ancestorChecked}
					form={form}
					label={label}
					count={count}
					onChange={handleChange}
				/>
			</Box>
		);
	}

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<Flex gap="2" align="center">
				<CollapsibleTrigger asChild>
					<IconButton size="1" variant="ghost" color="gray">
						{open ? (
							<ChevronUpIcon aria-label={t("close", { label })} />
						) : (
							<ChevronDownIcon aria-label={t("open", { label })} />
						)}
					</IconButton>
				</CollapsibleTrigger>

				<Box flexGrow="1">
					<DialectSelectorCheckbox
						name={name}
						value={value}
						checked={
							checkedDescendantsCount > 0
								? "indeterminate"
								: checked || dialectSelector.ancestorChecked
						}
						disabled={
							dialectSelector.ancestorChecked || checkedDescendantsCount > 0
						}
						form={form}
						label={label}
						count={count}
						onChange={handleChange}
					/>
				</Box>
			</Flex>

			<CollapsibleContent forceMount>
				<Box
					pl="4"
					style={{
						display: open ? "block" : "none",
					}}
				>
					<DialectSelectorProvider
						value={{
							ancestorChecked: checked || dialectSelector.ancestorChecked,
							onChange: handleChangeDescendant,
						}}
					>
						{children}
					</DialectSelectorProvider>
				</Box>
			</CollapsibleContent>
		</Collapsible>
	);
};

const DialectSelectorItemSkeleton: FC = () => {
	return (
		<Flex gap="2" align="center">
			<Skeleton>
				<IconButton size="1" variant="ghost" color="gray">
					<ChevronDownIcon />
				</IconButton>
			</Skeleton>

			<Flex gap="1" align="center" flexGrow="1">
				<Skeleton>
					<Checkbox />
				</Skeleton>

				<Skeleton>
					<Box flexGrow="1">
						<Text>北海道</Text>
					</Box>
				</Skeleton>
			</Flex>
		</Flex>
	);
};

export const DialectSelectorItem = {
	Root: DialectSelectorItemRoot,
	Skeleton: DialectSelectorItemSkeleton,
};
