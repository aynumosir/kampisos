import { expect } from "@playwright/test";
import { test } from "vitest";
import { toHref } from "./uri";

test("handles http", () => {
	const href = toHref("https://example.com");
	expect(href).toBe("https://example.com");
});

test("handles isbn", () => {
	const href = toHref("urn:isbn:1234567890123");
	expect(href).toBe("https://isbnsearch.org/isbn/1234567890123");
});
