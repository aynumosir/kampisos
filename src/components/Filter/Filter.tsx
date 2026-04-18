import { Button, Flex } from "@radix-ui/themes";
import { FC, use } from "react";
import { useTranslations } from "next-intl";
import { estypes } from "@elastic/elasticsearch";

import { Entry, EntryAggregate } from "@/models/entry";

import {
  DialectSelectorRoot,
  DialectSelectorSkeleton,
} from "../DialectSelector";
import { FilterItemRoot, FilterItemSkeleton } from "./FilterItem";

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
  searchResponsePromise: Promise<estypes.SearchResponse<Entry, EntryAggregate>>;
};

const FilterRoot: FC<FilterRootProps> = (props) => {
  const { defaultValues, searchResponsePromise } = props;

  const searchResponse = use(searchResponsePromise);
  const t = useTranslations("/components/Filter/Filter");

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
            dialectLv1: (
              searchResponse.aggregations?.dialect_lv1.inner as any
            ).buckets.reduce(
              (acc, bucket) => ({
                ...acc,
                [bucket.key]: bucket.doc_count,
              }),
              {},
            ),
            dialectLv2: (
              searchResponse.aggregations?.dialect_lv2.inner as any
            ).buckets.reduce(
              (acc, bucket) => ({
                ...acc,
                [bucket.key]: bucket.doc_count,
              }),
              {},
            ),
            dialectLv3: (
              searchResponse.aggregations?.dialect_lv3.inner as any
            ).buckets.reduce(
              (acc, bucket) => ({
                ...acc,
                [bucket.key]: bucket.doc_count,
              }),
              {},
            ),
          }}
        />

        {searchResponse.aggregations?.collection_lv1 && (
          <FilterItemRoot
            form="search"
            label={t("collection")}
            name="collection_lv1"
            defaultValues={defaultValues?.collectionLv1}
            options={(
              searchResponse.aggregations?.collection_lv1.inner as any[]
            ).buckets.map((bucket) => ({
              value: bucket.key,
              count: bucket.doc_count,
            }))}
          />
        )}

        {searchResponse.aggregations?.author && (
          <FilterItemRoot
            form="search"
            label={t("author")}
            name="author"
            defaultValues={defaultValues?.author}
            options={(
              searchResponse.aggregations?.author.inner as any[]
            ).buckets.map((bucket) => ({
              value: bucket.key,
              count: bucket.doc_count,
            }))}
          />
        )}

        {searchResponse.aggregations?.pronoun && (
          <FilterItemRoot
            form="search"
            label={t("pronoun")}
            name="pronoun"
            defaultValues={defaultValues?.pronoun}
            options={(
              searchResponse.aggregations?.pronoun.inner as any[]
            ).buckets.map((bucket) => ({
              label: bucket.key === "first" ? t("first") : t("fourth"),
              value: bucket.key,
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
