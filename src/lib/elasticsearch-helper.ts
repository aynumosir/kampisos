import { EntryAggregate, EntryHit } from "@/models/entry";
import { estypes } from "@elastic/elasticsearch";

export const getTotalHits = (
  searchResponse: estypes.SearchResponse,
): number | undefined => {
  const total = searchResponse.hits.total;

  if (!total) {
    return;
  }

  if (typeof total === "number") {
    return total;
  }

  return total.value;
};

export const getAggregationBuckets = (
  searchResponse: estypes.SearchResponse<EntryHit, EntryAggregate>,
  key: keyof EntryAggregate,
): estypes.AggregationsFiltersBucketKeys[] | undefined => {
  const aggs = searchResponse.aggregations?.[key];
  if (!aggs) {
    return;
  }

  if (!("inner" in aggs)) {
    return;
  }

  const inner = aggs.inner as estypes.AggregationsMultiBucketAggregateBase;
  return inner.buckets as estypes.AggregationsFiltersBucketKeys[];
};

export type BuildRequestsParams = {
  /** 検索文字列 */
  query: string;
  /** ページ番号 */
  page: number;
  /** ページあたりの件数 */
  size: number;

  filters: {
    /** 方言 */
    dialect_lv1: string[];
    dialect_lv2: string[];
    dialect_lv3: string[];
    /** 本 */
    collection_lv1: string[];
    /** 著者 */
    author: string[];
    /** 代名詞 */
    pronoun: string[];
  };
};

export const buildSearchRequest = (
  params: BuildRequestsParams,
): estypes.SearchRequest => {
  const { query, page, size, filters } = params;

  const filter = Object.entries(filters)
    .filter(([, value]) => value.length > 0)
    .map(([key, value]) => ({
      terms: { [key]: value },
    }));

  const aggs: Record<string, estypes.AggregationsAggregationContainer> = {};
  for (const selfKey of Object.keys(filters)) {
    const filter = Object.entries(filters)
      .filter(([key, value]) => key !== selfKey && value.length > 0)
      .map(([key, value]) => ({
        terms: { [key]: value },
      }));

    aggs[selfKey] = {
      filter: {
        bool: {
          filter,
        },
      },
      aggs: {
        inner: {
          terms: {
            field: selfKey,
            size: 100,
          },
        },
      },
    };

    const queriesAinu: estypes.QueryDslQueryContainer[] = [
      {
        match: {
          text: {
            query,
            operator: "AND",
          },
        },
      },
      {
        match_phrase: {
          "text.ngram": {
            query,
          },
        },
      },
      {
        match: {
          text: {
            query,
            operator: "AND",
            fuzziness: "AUTO",
          },
        },
      },
    ];

    const queriesJapanese: estypes.QueryDslQueryContainer = {
      match: {
        translation: {
          query,
          operator: "AND",
        },
      },
    };

    const queriesBilingual: estypes.QueryDslQueryContainer[] = [
      {
        bool: {
          must: [
            { match: { text: { query, operator: "AND" } } },
            { match: { translation: { query, operator: "AND" } } },
          ],
        },
      },
      {
        bool: {
          must: [
            {
              match: {
                text: { query, operator: "AND", fuzziness: "AUTO" },
              },
            },
            { match: { translation: { query, operator: "AND" } } },
          ],
        },
      },
    ];

    return {
      index: "kampisos-entries",
      size,
      from: size * page,

      query: {
        dis_max: {
          queries: [
            {
              bool: {
                should: queriesAinu,
                must_not: queriesJapanese,
              },
            },
            {
              bool: {
                must: queriesJapanese,
                must_not: queriesAinu,
              },
            },
            {
              bool: {
                should: queriesBilingual,
              },
            },
          ],
        },
      },

      aggregations: aggs,

      post_filter: {
        bool: {
          filter,
        },
      },

      highlight: {
        number_of_fragments: 0,
        fields: {
          translation: {},
          text: {},
          "text.ngram": {},
        },
      },
    };
  }
};
