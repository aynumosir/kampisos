import { expect, test } from "@playwright/test";

test("使い方を表示できる", async ({ page }) => {
	await page.goto("/ja/about");
	await expect(page).toHaveTitle(
		"このサイトについて | Kampisos - アイヌ語オンラインコーパス",
	);
});
