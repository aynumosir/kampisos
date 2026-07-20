import { expect, test } from "vitest";
import { getMostDetailedDialects } from "./getMostDetailedDialects";

test("getMostDetailedDialects", () => {
	const dialects = getMostDetailedDialects(
		["北海道", "樺太"],
		["北海道/南西"],
		["北海道/南西/千歳"],
	);

	expect(dialects).toEqual(["北海道/南西/千歳", "樺太"]);
});
