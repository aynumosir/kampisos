import "./style.css";

import { Container, Flex, Link as RadixLink } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import type { FC } from "react";

import { Link } from "@/i18n/navigation";

export const Banner: FC = () => {
	const t = useTranslations("/components/Banner/Banner");

	return (
		<header className="banner">
			<Container size="4" p="3">
				<Flex justify="between" align="center">
					<Link href="/">
						<h1>Kampisos</h1>
					</Link>

					<RadixLink asChild>
						<Link href="/about">{t("about")}</Link>
					</RadixLink>
				</Flex>
			</Container>
		</header>
	);
};
