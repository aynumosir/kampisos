/** biome-ignore-all lint/suspicious/noShadowRestrictedNames: Next.jsの規定のため */
"use client";

import {
	Button,
	Code,
	Container,
	Heading,
	Section,
	Separator,
	Text,
} from "@radix-ui/themes";
import { useTranslations } from "next-intl";

export type ErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function Error(props: ErrorProps) {
	const { error, reset } = props;

	const t = useTranslations("/app/[locale]/error");

	return (
		<Container size="2" m="3">
			<main>
				<Section size="2">
					<Heading as="h2" size={{ initial: "7", sm: "8" }} weight="bold">
						{t("title")}
					</Heading>

					<Separator size="4" my="4" />

					<Text color="gray" mt="2" asChild>
						<p>{t("description")}</p>
					</Text>

					<Text color="gray" mt="2" asChild>
						<Code asChild>
							<pre>{JSON.stringify({ digest: error.digest }, null, 2)}</pre>
						</Code>
					</Text>

					<Button onClick={reset} mt="4">
						{t("reload")}
					</Button>
				</Section>
			</main>
		</Container>
	);
}
