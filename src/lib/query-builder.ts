import { estypes } from "@elastic/elasticsearch";

export type BuildRequestsParams = {
  /** 検索文字列 */
  query: string;
  /** ページ番号 */
  page: number;

  facets: {
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
  const { query, page, facets } = params;

  const filter = [];
  if (facets.dialect_lv1.length > 0) {
    filter.push({
      terms: {
        dialect_lv1: facets.dialect_lv1,
      },
    });
  }
  if (facets.dialect_lv2.length > 0) {
    filter.push({
      terms: {
        dialect_lv2: facets.dialect_lv2,
      },
    });
  }
  if (facets.dialect_lv3.length > 0) {
    filter.push({
      terms: {
        dialect_lv3: facets.dialect_lv3,
      },
    });
  }
  if (facets.collection_lv1.length > 0) {
    filter.push({
      terms: {
        collection_lv1: facets.collection_lv1,
      },
    });
  }
  if (facets.author.length > 0) {
    filter.push({
      terms: {
        author: facets.author,
      },
    });
  }
  if (facets.pronoun.length > 0) {
    filter.push({
      terms: {
        pronoun: facets.pronoun,
      },
    });
  }

  const facetEntries = Object.entries(facets) as [string, string[]][];

  const buildTermsFilter = (f: any): estypes.QueryDslQueryContainer[] =>
    Object.entries(f)
      .filter(([, values]) => values.length > 0)
      .map(([field, values]) => ({ terms: { [field]: values } }));

  // 全facetのaggregationを構築
  // 選択済みfacetは「自分以外のフィルター」をかけたfilter aggの中に入れる
  const aggs: Record<string, estypes.AggregationsAggregationContainer> = {};

  for (const [selfKey, selfValues] of facetEntries) {
    const otherFacets = Object.fromEntries(
      facetEntries.filter(([key]) => key !== selfKey),
    );
    const filterClauses = buildTermsFilter(otherFacets);

    aggs[selfKey] = {
      filter: {
        bool: { filter: filterClauses },
      },
      aggs: {
        inner: { terms: { field: selfKey, size: 100 } },
      },
    };
  }

  const ret = {
    index: "kampisos-entries",
    size: 20,
    from: page,

    query: {
      multi_match: {
        query,
        type: "phrase",
        fields: ["translation^3", "text"],
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
      },
    },
  };

  return ret;
};
