import { Box, Flex, Heading, Separator, Text } from "@radix-ui/themes";
import { estypes } from "@elastic/elasticsearch";
import { FC, Fragment, use } from "react";

import { Entry } from "@/components/Entry";
import { Entry as EntryType } from "@/models/entry";
import { useTranslations } from "next-intl";

type ResultRootProps = {
  searchResponsePromise: Promise<estypes.SearchResponse<EntryType>>;
};

const ResultRoot: FC<ResultRootProps> = (props) => {
  const { searchResponsePromise } = props;

  const searchResponse = use(searchResponsePromise);
  const t = useTranslations("/app/[locale]/search/Result");

  if (
    searchResponse.hits.total &&
    typeof searchResponse.hits.total !== "number" &&
    searchResponse.hits.total.value <= 0
  ) {
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
      {searchResponse.hits.hits.map(({ _source, highlight }, i) => {
        const last = i === searchResponse.hits.hits.length - 1;

        // REMOVE ME
        _source = _source!;

        return (
          <Fragment key={_source.id}>
            <Entry.Root
              objectID={_source.id}
              text={_source.text}
              translation={_source.translation}
              textHTML={highlight?.text?.[0] ?? _source.text}
              translationHTML={
                highlight?.translation?.[0] ?? _source.translation
              }
              collectionLv1={_source.collection_lv1}
              collectionLv2={_source.collection_lv2}
              collectionLv3={_source.collection_lv3}
              document={_source.document}
              uri={_source.uri}
              author={_source.author}
              dialectLv1={_source.dialect_lv1}
              dialectLv2={_source.dialect_lv2}
              dialectLv3={_source.dialect_lv3}
              publishedAt={_source.published_at}
              recordedAt={_source.recorded_at}
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
