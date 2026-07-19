import { describe, expect, it } from "vitest";
import { deepMerge } from "./deepMerge";

describe("deepMerge", () => {
	it("nested object merge", () => {
		const a = { user: { name: "alice", age: 20 } };
		const b = { user: { age: 21 } };

		expect(deepMerge(a, b)).toEqual({
			user: { name: "alice", age: 21 },
		});
	});
});
