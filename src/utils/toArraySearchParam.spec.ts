import { expect, test } from "vitest";

import { toArraySearchParam } from "./toArraySearchParams";

test("toArraySearchParam", () => {
	expect(toArraySearchParam("foo")).toEqual(["foo"]);
	expect(toArraySearchParam(["foo"])).toEqual(["foo"]);
	expect(toArraySearchParam(undefined)).toEqual([]);
});
