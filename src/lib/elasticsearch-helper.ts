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
  from: number;
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
  const { query, from, size, filters } = params;

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
  }

  return {
    index: "kampisos-entries",
    size,
    from,

    query: {
      dis_max: {
        queries: [
          // アイヌ語のみの場合
          {
            bool: {
              should: [
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
              ],
            },
          },

          // 日本語のみの場合
          {
            match: {
              translation: {
                query,
                operator: "AND",
              },
            },
          },

          // アイヌ語・日本語の両方の場合
          {
            bool: {
              should: [
                {
                  bool: {
                    must: [
                      { match: { text: { query } } },
                      { match: { translation: { query } } },
                    ],
                  },
                },
                {
                  bool: {
                    must: [
                      { match: { text: { query, fuzziness: "AUTO" } } },
                      { match: { translation: { query } } },
                    ],
                  },
                },
              ],
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
};
