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

test("https://github.com/aynumosir/kampisos/issues/74", () => {
	const dialects = getMostDetailedDialects(
		[],
		["北海道/南西", "樺太/東海岸"],
		["北海道/南西/千歳"],
	);

	expect(dialects).toEqual(["北海道/南西/千歳", "樺太/東海岸"]);
});
