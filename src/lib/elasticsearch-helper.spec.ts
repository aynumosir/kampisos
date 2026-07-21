import { describe, expect, it } from "vitest";

import { buildSearchRequest } from "./elasticsearch-helper";

const baseParams = {
  query: "kamuy 熊",
  page: 0,
  size: 20,
  filters: {
    dialect_lv1: [] as string[],
    dialect_lv2: [] as string[],
    dialect_lv3: [] as string[],
    collection_lv1: [] as string[],
    author: [] as string[],
    pronoun: [] as string[],
  },
};

describe("buildSearchRequest", () => {
  it("reports the true total instead of the ES 10k cap (#70)", () => {
    const request = buildSearchRequest(baseParams);
    expect(request.track_total_hits).toBe(true);
  });

  it("intersects text and translation instead of unioning them (#70)", () => {
    const request = buildSearchRequest(baseParams);

    // A dis_max (union/OR) would inflate the total to match-or-matches.
    // The query must be a bool/must (intersection/AND) so the reported
    // count only includes entries matching both the Ainu text and the
    // Japanese translation.
    expect((request.query as { dis_max?: unknown }).dis_max).toBeUndefined();

    const bool = (request.query as { bool: { must: unknown[] } }).bool;
    expect(bool).toBeDefined();
    expect(bool.must).toHaveLength(2);

    // First clause targets the Ainu `text` field.
    const textClause = bool.must[0] as {
      bool: { should: { match?: unknown; match_phrase?: unknown }[] };
    };
    const textFields = textClause.bool.should.flatMap((s) =>
      Object.keys(s),
    );
    expect(textFields).toContain("match");

    // Second clause targets the Japanese `translation` field.
    const translationClause = bool.must[1] as {
      match: { translation: unknown };
    };
    expect(translationClause.match.translation).toBeDefined();
  });
});
