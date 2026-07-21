import { describe, expect, it } from "vitest";

import {
	type BuildRequestsParams,
	buildSearchRequest,
} from "./elasticsearch-helper";

const baseParams: BuildRequestsParams = {
	query: "kamuy",
	page: 0,
	size: 20,
	filters: {
		dialect_lv1: [],
		dialect_lv2: [],
		dialect_lv3: [],
		collection_lv1: [],
		author: [],
		pronoun: [],
	},
};

/** post_filter から range クエリだけを抜き出す */
const getRangeClauses = (request: ReturnType<typeof buildSearchRequest>) => {
	const filter = (request.post_filter as { bool: { filter: object[] } }).bool
		.filter;
	return filter.filter((clause) => Object.hasOwn(clause, "range")) as {
		range: Record<string, { gte?: string; lte?: string }>;
	}[];
};

describe("buildSearchRequest date ranges (#7)", () => {
	it("adds no range clause when dateRanges is omitted", () => {
		const request = buildSearchRequest(baseParams);
		expect(getRangeClauses(request)).toHaveLength(0);
	});

	it("adds no range clause for an empty range", () => {
		const request = buildSearchRequest({
			...baseParams,
			dateRanges: { published_at: {} },
		});
		expect(getRangeClauses(request)).toHaveLength(0);
	});

	it("emits a gte/lte range for a full from/to published_at range", () => {
		const request = buildSearchRequest({
			...baseParams,
			dateRanges: {
				published_at: { from: "2000-01-01", to: "2010-12-31" },
			},
		});

		const clauses = getRangeClauses(request);
		expect(clauses).toHaveLength(1);
		expect(clauses[0].range.published_at).toEqual({
			gte: "2000-01-01",
			lte: "2010-12-31",
		});
	});

	it("emits only gte when only from is given", () => {
		const request = buildSearchRequest({
			...baseParams,
			dateRanges: { recorded_at: { from: "1990-01-01" } },
		});

		const clauses = getRangeClauses(request);
		expect(clauses).toHaveLength(1);
		expect(clauses[0].range.recorded_at).toEqual({ gte: "1990-01-01" });
	});

	it("emits only lte when only to is given", () => {
		const request = buildSearchRequest({
			...baseParams,
			dateRanges: { recorded_at: { to: "2020-01-01" } },
		});

		const clauses = getRangeClauses(request);
		expect(clauses).toHaveLength(1);
		expect(clauses[0].range.recorded_at).toEqual({ lte: "2020-01-01" });
	});

	it("supports both date fields at once", () => {
		const request = buildSearchRequest({
			...baseParams,
			dateRanges: {
				published_at: { from: "2000-01-01" },
				recorded_at: { to: "2020-01-01" },
			},
		});
		expect(getRangeClauses(request)).toHaveLength(2);
	});

	it("propagates the range into facet aggregations", () => {
		const request = buildSearchRequest({
			...baseParams,
			filters: { ...baseParams.filters, author: ["知里"] },
			dateRanges: { published_at: { from: "2000-01-01" } },
		});

		const aggs = request.aggregations as Record<
			string,
			{ filter: { bool: { filter: object[] } } }
		>;

		// 全ての facet 集計に range が含まれる
		for (const key of Object.keys(aggs)) {
			const clauses = aggs[key].filter.bool.filter.filter((clause) =>
				Object.hasOwn(clause, "range"),
			);
			expect(clauses).toHaveLength(1);
		}

		// author facet 自身は除外されるが range は残る
		const authorFilter = aggs.author.filter.bool.filter;
		expect(authorFilter.some((c) => Object.hasOwn(c, "terms"))).toBe(false);
	});
});
