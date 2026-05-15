import { Flex, Heading, Skeleton, Text } from "@radix-ui/themes";
import { estypes } from "@elastic/elasticsearch";
import { FC, ReactNode, use } from "react";
import { useTranslations } from "next-intl";

import { EntryAggregate, EntryHit } from "@/models/entry";
import { getTotalHits } from "@/lib/elasticsearch-helper";

type SearchStatsRootProps = {
  id?: string;
  query: string;
  searchResponsePromise: Promise<
    estypes.SearchResponse<EntryHit, EntryAggregate>
  >;
  suffix?: ReactNode;
};

const SearchStatsRoot: FC<SearchStatsRootProps> = (props) => {
  const { id, query, searchResponsePromise, suffix } = props;

  const t = useTranslations("/app/[locale]/search/SearchStats");
  const searchResponse = use(searchResponsePromise);

  const totalHits = getTotalHits(searchResponse) ?? 0;
  const formattedTotalHits = Intl.NumberFormat("ja-JP").format(totalHits);

  return (
    <Flex align="center" justify="between">
      <Heading id={id} as="h3" size="4">
        <Flex gap="1" align="center">
          <Text>{t.rich("title", { query })}</Text>

          <Text size="1" color="gray" weight="medium">
            {t("nb_hits", { n: formattedTotalHits })}
          </Text>
        </Flex>
      </Heading>

      {suffix}
    </Flex>
  );
};

const SearchStatsSkeleton: FC = () => {
  const t = useTranslations("/app/[locale]/search/SearchStats");

  return (
    <Heading as="h3" size="4">
      <Flex gap="1" align="center">
        <Skeleton>
          <Text>{t.rich("title", { query: "foo" })}</Text>
        </Skeleton>

        <Skeleton>
          <Text size="1" color="gray" weight="medium">
            {t("nb_hits", { n: 1000 })}
          </Text>
        </Skeleton>
      </Flex>
    </Heading>
  );
};

export const SearchStats = {
  Root: SearchStatsRoot,
  Skeleton: SearchStatsSkeleton,
};
