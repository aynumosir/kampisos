import { Badge, Checkbox, Flex, Text, VisuallyHidden } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import type { FC, ReactNode } from "react";

export type CheckedState = "indeterminate" | boolean;

export type DialectSelectorCheckboxProps = {
	name: string;
	value: string;
	checked?: CheckedState;
	disabled?: boolean;
	form?: string;
	label: ReactNode;
	count?: number;
	onChange?: (checked: boolean) => void;
};

export const DialectSelectorCheckbox: FC<DialectSelectorCheckboxProps> = (
	props,
) => {
	const { name, value, checked, disabled, form, label, count, onChange } =
		props;

	const t = useTranslations(
		"/components/DialectSelector/DialectSelectorCheckbox",
	);

	return (
		<Flex gap="1" align="center" asChild>
			<Text as="label">
				<Checkbox
					name={name}
					value={value}
					checked={checked}
					disabled={disabled}
					form={form}
					onCheckedChange={onChange}
				/>

				<Flex
					flexGrow="1"
					gap="1"
					justify="between"
					align="center"
					minWidth="0"
				>
					<Text truncate>{label}</Text>

					{count && (
						<Badge variant="soft" color="gray">
							{t.rich("count", {
								count,
								vh: (chunks) => <VisuallyHidden>{chunks}</VisuallyHidden>,
							})}
						</Badge>
					)}
				</Flex>
			</Text>
		</Flex>
	);
};
