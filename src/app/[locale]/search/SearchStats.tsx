import { Flex, Heading, Skeleton, Text } from "@radix-ui/themes";
import { estypes } from "@elastic/elasticsearch";
import { FC, ReactNode, use } from "react";
import { useTranslations } from "next-intl";

import { Entry } from "@/models/entry";

type SearchStatsRootProps = {
  id?: string;
  searchResponsePromise: Promise<estypes.SearchResponse<Entry>>;
  suffix?: ReactNode;
};

const SearchStatsRoot: FC<SearchStatsRootProps> = (props) => {
  const { id, searchResponsePromise, suffix } = props;

  const t = useTranslations("/app/[locale]/search/SearchStats");

  const searchResponse = use(searchResponsePromise);
  const nbHits =
    searchResponse.hits.total &&
    Intl.NumberFormat("ja-JP").format((searchResponse.hits.total as any).value);
  const processingTimeMS = searchResponse.took;

  return (
    <Flex align="center" justify="between">
      <Heading id={id} as="h3" size="4">
        <Flex gap="1" align="center">
          {nbHits != null && t("nb_hits", { n: nbHits })}

          {processingTimeMS != null && (
            <Text size="1" color="gray" weight="medium">
              {t("processing_time_ms", { ms: processingTimeMS })}
            </Text>
          )}
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
          <Text>{t("nb_hits", { n: "1,000" })}</Text>
        </Skeleton>

        <Skeleton>
          <Text size="1" color="gray" weight="medium">
            {t("processing_time_ms", { ms: 100 })}
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
