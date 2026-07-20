import assert from "node:assert";

import { createClient } from "microcms-js-sdk";

assert(process.env.MICROCMS_SERVICE_DOMAIN);
assert(process.env.MICROCMS_API_KEY);

export const client = createClient({
	serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
	apiKey: process.env.MICROCMS_API_KEY,
});
