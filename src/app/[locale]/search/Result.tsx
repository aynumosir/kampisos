import { Box, Flex, Heading, Separator, Text } from "@radix-ui/themes";
import { estypes } from "@elastic/elasticsearch";
import { FC, Fragment, use } from "react";
import { useTranslations } from "next-intl";

import { Entry } from "@/components/Entry";
import { EntryAggregate, EntryHit } from "@/models/entry";
import { getTotalHits } from "@/lib/elasticsearch-helper";

type ResultRootProps = {
  searchResponsePromise: Promise<
    estypes.SearchResponse<EntryHit, EntryAggregate>
  >;
};

const ResultRoot: FC<ResultRootProps> = (props) => {
  const { searchResponsePromise } = props;

  const searchResponse = use(searchResponsePromise);
  const t = useTranslations("/app/[locale]/search/Result");

  const totalHits = getTotalHits(searchResponse);
  if (!totalHits || totalHits <= 0) {
    return (
      <Flex py="8" direction="column" align="center">
        <Heading size="4">{t("no_result")}</Heading>

        <p>
          <Text color="gray" mt="2">
            {t("no_result_hint")}
          </Text>
        </p>
      </Flex>
    );
  }

  return (
    <Box>
      {searchResponse.hits.hits.map((hit, i) => {
        if (!hit._source) {
          return null;
        }

        const last = i === searchResponse.hits.hits.length - 1;

        return (
          <Fragment key={hit._source.id}>
            <Entry.Root
              objectID={hit._source.id}
              score={hit._score}
              textHTML={hit.highlight?.text?.[0] ?? hit._source.text}
              translationHTML={
                hit.highlight?.translation?.[0] ?? hit._source.translation
              }
              collectionLv1={hit._source.collection_lv1}
              collectionLv2={hit._source.collection_lv2}
              collectionLv3={hit._source.collection_lv3}
              document={hit._source.document}
              uri={hit._source.uri}
              author={hit._source.author}
              dialectLv1={hit._source.dialect_lv1}
              dialectLv2={hit._source.dialect_lv2}
              dialectLv3={hit._source.dialect_lv3}
              publishedAt={hit._source.published_at}
              recordedAt={hit._source.recorded_at}
            />

            {!last && (
              <Box my="3">
                <Separator size="4" />
              </Box>
            )}
          </Fragment>
        );
      })}
    </Box>
  );
};

const ResultSkeleton: FC = () => {
  return (
    <div>
      {[...Array(16)].map((_, index) => {
        const last = index === 7;
        return (
          <Fragment key={index}>
            <Entry.Skeleton />

            {!last && (
              <Box my="3">
                <Separator size="4" />
              </Box>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export const Result = {
  Root: ResultRoot,
  Skeleton: ResultSkeleton,
};
