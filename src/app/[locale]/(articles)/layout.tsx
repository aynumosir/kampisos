import { Container } from "@radix-ui/themes";
import { Metadata, ResolvingMetadata } from "next";

export const revalidate = 86_400;

export async function generateMetadata(
  _props: LayoutProps<"/[locale]">,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = await parent;

  return {
    title: parentMetadata.title,
    description: parentMetadata.description,
  };
}

export default async function ArticleLayout(props: LayoutProps<"/[locale]">) {
  const { children } = props;

  return (
    <Container size="3" m="3" asChild>
      <main lang="ja">
        <article>{children}</article>
      </main>
    </Container>
  );
}
