import { FC } from "react";
import { Flex, Text, Link as RadixLink, Box } from "@radix-ui/themes";
import { useTranslations } from "next-intl";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Link } from "@/i18n/navigation";

type NoteType = "legacy";

const getNoteType = (collectionLv1: string | null): NoteType | null => {
  if (
    collectionLv1 &&
    ["アイヌ語訳新約聖書", "アイヌ語音声資料", "アイヌ民譚集"].includes(
      collectionLv1,
    )
  ) {
    return "legacy";
  }

  return null;
};

// ----------

export type EntryNotesProps = {
  collectionLv1: string | null;
};

export const EntryNotes: FC<EntryNotesProps> = (props) => {
  const { collectionLv1 } = props;
  const noteType = getNoteType(collectionLv1);

  const t = useTranslations("/components/Entry/EntryNotes");

  if (noteType === "legacy") {
    return (
      <Flex align="center" gap="1">
        <Box flexShrink="0" asChild>
          <ExclamationTriangleIcon
            color="orange"
            aria-hidden
            width={12}
            height={12}
          />
        </Box>

        <Text color="orange" size="2" as="p">
          {t.rich("legacy", {
            link: (chunks) => (
              <RadixLink asChild>
                <Link href="/lessons/orthography">{chunks}</Link>
              </RadixLink>
            ),
          })}
        </Text>
      </Flex>
    );
  }

  return null;
};
