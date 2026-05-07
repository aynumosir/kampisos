import { Button, Flex } from "@radix-ui/themes";
import { FC, use } from "react";
import { useTranslations } from "next-intl";
import { estypes } from "@elastic/elasticsearch";

import { EntryHit, EntryAggregate } from "@/models/entry";

import {
  DialectSelectorRoot,
  DialectSelectorSkeleton,
} from "../DialectSelector";
import { FilterItemRoot, FilterItemSkeleton } from "./FilterItem";
import { getAggregationBuckets } from "@/lib/elasticsearch-helper";

export type FilterRootProps = {
  className?: string;
  defaultValues?: {
    collectionLv1?: string[];
    author?: string[];
    pronoun?: string[];
    dialectLv1?: string[];
    dialectLv2?: string[];
    dialectLv3?: string[];
  };
  searchResponsePromise: Promise<
    estypes.SearchResponse<EntryHit, EntryAggregate>
  >;
};

const FilterRoot: FC<FilterRootProps> = (props) => {
  const { defaultValues, searchResponsePromise } = props;

  const searchResponse = use(searchResponsePromise);
  const t = useTranslations("/components/Filter/Filter");

  const aggsDialectLv1 = getAggregationBuckets(searchResponse, "dialect_lv1");
  const aggsDialectLv2 = getAggregationBuckets(searchResponse, "dialect_lv2");
  const aggsDialectLv3 = getAggregationBuckets(searchResponse, "dialect_lv3");
  const aggsCollectionLv1 = getAggregationBuckets(
    searchResponse,
    "collection_lv1",
  );
  const aggsAuthor = getAggregationBuckets(searchResponse, "author");
  const aggsPronoun = getAggregationBuckets(searchResponse, "pronoun");

  return (
    <Flex direction="column" gap="5">
      <Flex direction="column" gap="4">
        <DialectSelectorRoot
          form="search"
          values={{
            dialectLv1: defaultValues?.dialectLv1,
            dialectLv2: defaultValues?.dialectLv2,
            dialectLv3: defaultValues?.dialectLv3,
          }}
          counts={{
            dialectLv1: aggsDialectLv1?.reduce(
              (acc, bucket) => ({
                ...acc,
                [bucket.key!]: bucket.doc_count,
              }),
              {},
            ),
            dialectLv2: aggsDialectLv2?.reduce(
              (acc, bucket) => ({
                ...acc,
                [bucket.key!]: bucket.doc_count,
              }),
              {},
            ),
            dialectLv3: aggsDialectLv3?.reduce(
              (acc, bucket) => ({
                ...acc,
                [bucket.key!]: bucket.doc_count,
              }),
              {},
            ),
          }}
        />

        {aggsCollectionLv1 && (
          <FilterItemRoot
            form="search"
            label={t("collection")}
            name="collection_lv1"
            defaultValues={defaultValues?.collectionLv1}
            options={aggsCollectionLv1.map((bucket) => ({
              value: bucket.key!,
              count: bucket.doc_count,
            }))}
          />
        )}

        {aggsAuthor && (
          <FilterItemRoot
            form="search"
            label={t("author")}
            name="author"
            defaultValues={defaultValues?.author}
            options={aggsAuthor.map((bucket) => ({
              value: bucket.key!,
              count: bucket.doc_count,
            }))}
          />
        )}

        {aggsPronoun && (
          <FilterItemRoot
            form="search"
            label={t("pronoun")}
            name="pronoun"
            defaultValues={defaultValues?.pronoun}
            options={aggsPronoun.map((bucket) => ({
              label: bucket.key === "first" ? t("first") : t("fourth"),
              value: bucket.key!,
              count: bucket.doc_count,
            }))}
          />
        )}
      </Flex>

      <Button form="search" type="submit">
        {t("apply")}
      </Button>
    </Flex>
  );
};

// --------------------------------------------------

const FilterSkeleton: FC = () => {
  return (
    <Flex direction="column" gap="5">
      <Flex direction="column" gap="4">
        <DialectSelectorSkeleton />
        <FilterItemSkeleton />
        <FilterItemSkeleton />
        <FilterItemSkeleton />
      </Flex>

      <Button disabled>適用</Button>
    </Flex>
  );
};

// --------------------------------------------------

export const Filter = {
  Root: FilterRoot,
  Skeleton: FilterSkeleton,
};
