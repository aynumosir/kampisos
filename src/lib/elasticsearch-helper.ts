import type { estypes } from "@elastic/elasticsearch";
import type { EntryAggregate, EntryHit } from "@/models/entry";

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

export type DateField = "published_at" | "recorded_at";

export type DateRange = {
	from?: string;
	to?: string;
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

	/** 公開日 / 記録日による範囲絞り込み (#7) */
	dateRanges?: Partial<Record<DateField, DateRange>>;
};

/** 範囲条件を ES の range クエリに変換する。from/to の両方が空なら undefined。 */
const buildRangeClause = (
	field: DateField,
	range: DateRange | undefined,
): estypes.QueryDslQueryContainer | undefined => {
	if (!range) {
		return undefined;
	}
	const { from, to } = range;
	if (!from && !to) {
		return undefined;
	}
	return {
		range: {
			[field]: {
				...(from ? { gte: from } : {}),
				...(to ? { lte: to } : {}),
			},
		},
	};
};

export const buildSearchRequest = (
	params: BuildRequestsParams,
): estypes.SearchRequest => {
	const { query, page, size, filters, dateRanges = {} } = params;

	const termsFilter = Object.entries(filters)
		.filter(([, value]) => value.length > 0)
		.map(([key, value]) => ({
			terms: { [key]: value },
		}));

	const rangeFilter: estypes.QueryDslQueryContainer[] = (
		Object.keys(dateRanges) as DateField[]
	)
		.map((field) => buildRangeClause(field, dateRanges[field]))
		.filter(
			(clause): clause is estypes.QueryDslQueryContainer =>
				clause !== undefined,
		);

	const filter = [...termsFilter, ...rangeFilter];

	const aggs: Record<string, estypes.AggregationsAggregationContainer> = {};
	for (const selfKey of Object.keys(filters)) {
		const aggTermsFilter = Object.entries(filters)
			.filter(([key, value]) => key !== selfKey && value.length > 0)
			.map(([key, value]) => ({
				terms: { [key]: value },
			}));

		aggs[selfKey] = {
			filter: {
				bool: {
					// 日付範囲は facet ではないため、全 facet の集計にそのまま適用する。
					filter: [...aggTermsFilter, ...rangeFilter],
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
		from: size * page,

		query: {
			bool: {
				must: [
					{
						bool: {
							should: [
								{
									match: {
										text: {
											query,
											operator: "AND",
											zero_terms_query: "all",
										},
									},
								},
								{
									match_phrase: {
										"text.ngram": {
											query,
											zero_terms_query: "all",
										},
									},
								},
								{
									match: {
										text: {
											query,
											operator: "AND",
											fuzziness: "AUTO",
											zero_terms_query: "all",
										},
									},
								},
							],
						},
					},

					{
						match: {
							translation: {
								query,
								operator: "AND",
								zero_terms_query: "all",
							},
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
