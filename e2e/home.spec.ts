import { expect, test } from "@playwright/test";

test("トップページを表示できる", async ({ page }) => {
	await page.goto("/ja");

	await expect(page).toHaveTitle("Kampisos - アイヌ語オンラインコーパス");
});
