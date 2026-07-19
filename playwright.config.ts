import { defineConfig, devices } from "@playwright/test";

const PORT = process.env.PORT ?? 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
	timeout: 30 * 1000,
	testDir: "e2e",
	retries: 2,
	outputDir: "test-results/",

	webServer: {
		command: "npm run dev",
		url: baseURL,
		timeout: 120 * 1000,
		reuseExistingServer: !process.env.CI,
	},

	use: {
		baseURL,
		trace: "retry-with-trace",
	},

	projects: [
		{
			name: "Desktop Chrome",
			use: {
				...devices["Desktop Chrome"],
			},
		},
	],
});
