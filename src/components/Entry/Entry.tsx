import "./style.css";

import { ExternalLinkIcon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  Link,
  Skeleton,
  Text,
  VisuallyHidden,
} from "@radix-ui/themes";
import { FC } from "react";
import { useTranslations } from "next-intl";

import { toHref } from "@/utils/uri";
import { formatDateOrRange } from "@/utils/timestamp";

import { EntryDetailsDialog } from "./EntryDetailsDialog";
import { EntryAuthor } from "./EntryAuthor";
import { EntryNotes } from "./EntryNotes";

export type EntryRootProps = {
  objectID: string;
  document: string;
  text: string;
  textHTML: string;
  translation: string;
  translationHTML: string;
  collectionLv1: string | null;
  collectionLv2: string | null;
  collectionLv3: string | null;
  uri: string | null;
  author: string | null;
  dialectLv1: string[] | null;
  dialectLv2: string[] | null;
  dialectLv3: string[] | null;
  recordedAt: string | null;
  publishedAt: string | null;
};

const EntryRoot: React.FC<EntryRootProps> = (props) => {
  const {
    objectID,
    textHTML,
    translationHTML,
    collectionLv1,
    collectionLv2,
    collectionLv3,
    document,
    uri,
    author,
    dialectLv1,
    dialectLv2,
    dialectLv3,
    recordedAt,
    publishedAt,
  } = props;

  const t = useTranslations("/components/Entry/Entry");
  const href = uri ? toHref(uri) : null;

  const date = recordedAt ?? publishedAt;
  const reference = date
    ? t.rich("reference_with_year", {
        year: formatDateOrRange(date, "YYYY")!,
        reference: collectionLv1 ?? document,
        vh: (chunks) => <VisuallyHidden>{chunks}</VisuallyHidden>,
      })
    : t.rich("reference", {
        reference: collectionLv1 ?? document,
        vh: (chunks) => <VisuallyHidden>{chunks}</VisuallyHidden>,
      });

  return (
    <Flex className="entry" gap="1" direction="column">
      <EntryNotes collectionLv1={collectionLv1} />

      <Flex gap="2" direction={{ initial: "column", md: "row" }}>
        <Box flexGrow="1" flexShrink="1" flexBasis="100%" asChild>
          <Text asChild>
            <blockquote
              lang="ain"
              dangerouslySetInnerHTML={{ __html: textHTML }}
            />
          </Text>
        </Box>
        <Box flexGrow="1" flexShrink="1" flexBasis="100%" asChild>
          <Text asChild>
            <blockquote
              lang="ja"
              dangerouslySetInnerHTML={{ __html: translationHTML }}
            />
          </Text>
        </Box>
      </Flex>

      <Flex gap="2" justify="between" align="center">
        {href && (
          <Box flexGrow="0" flexShrink="1" minWidth="0px" asChild>
            <Flex align="center">
              <Link
                href={href}
                target="_blank"
                rel="nofollow"
                truncate
                size="2"
                color="gray"
              >
                <cite>{reference}</cite>
              </Link>

              <Box flexShrink="0" flexGrow="0" asChild>
                <ExternalLinkIcon
                  color="gray"
                  aria-label={t("open_in_new_tab")}
                />
              </Box>
            </Flex>
          </Box>
        )}

        <Flex gap="1" flexGrow="1" flexShrink="0" justify="end" align="center">
          {(author || dialectLv1 || dialectLv2 || dialectLv3) && (
            <Box flexGrow="1" flexShrink="0" asChild>
              <EntryAuthor
                author={author}
                dialectLv1={dialectLv1}
                dialectLv2={dialectLv2}
                dialectLv3={dialectLv3}
              />
            </Box>
          )}

          <EntryDetailsDialog
            objectID={objectID}
            collectionLv1={collectionLv1}
            collectionLv2={collectionLv2}
            collectionLv3={collectionLv3}
            document={document}
            author={author}
            dialectLv1={dialectLv1}
            dialectLv2={dialectLv2}
            dialectLv3={dialectLv3}
            uri={uri}
            recordedAt={recordedAt}
            publishedAt={publishedAt}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

const EntrySkeleton: FC = () => {
  return (
    <div>
      <Flex gap="2" direction={{ initial: "column", md: "row" }}>
        <Box flexGrow="1" flexShrink="1" flexBasis="100%" asChild>
          <Skeleton>
            <Text>irankarapte tanto sirpirka wa!</Text>
          </Skeleton>
        </Box>
        <Box flexGrow="1" flexShrink="1" flexBasis="100%" asChild>
          <Skeleton>
            <Text>こんにちは。今日は天気がいいですね！</Text>
          </Skeleton>
        </Box>
      </Flex>

      <Flex gap="2" justify="between" align="center" mt="1">
        <div>
          <Skeleton>
            <Link size="2">アイヌ語アーカイブ</Link>
          </Skeleton>
        </div>
      </Flex>
    </div>
  );
};

export const Entry = {
  Root: EntryRoot,
  Skeleton: EntrySkeleton,
};
