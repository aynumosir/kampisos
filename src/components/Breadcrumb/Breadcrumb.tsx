import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";
import { type FC, type ReactNode, useMemo } from "react";

export type BreadcrumbProps = {
	values: ReactNode[];
};

export const Breadcrumb: FC<BreadcrumbProps> = (props) => {
	const { values } = props;

	const nodes = useMemo(() => {
		const nodes: ReactNode[] = [];

		if (!values) {
			return null;
		}

		for (const [key, fragment] of Object.entries(values)) {
			if (nodes.length !== 0) {
				nodes.push(<ChevronRightIcon color="gray" key={key} aria-label="→" />);
			}

			nodes.push(fragment);
		}

		return nodes;
	}, [values]);

	if (!nodes) {
		return null;
	}

	return (
		<Flex align="center" wrap="wrap">
			{nodes}
		</Flex>
	);
};
