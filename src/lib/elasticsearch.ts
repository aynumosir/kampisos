import assert from "node:assert";
import { Client } from "@elastic/elasticsearch";

let auth: ConstructorParameters<typeof Client>[0]["auth"];
if (process.env.ELASTICSEARCH_PASSWORD) {
	assert(process.env.ELASTICSEARCH_USERNAME);
	assert(process.env.ELASTICSEARCH_PASSWORD);
	auth = {
		username: process.env.ELASTICSEARCH_USERNAME,
		password: process.env.ELASTICSEARCH_PASSWORD,
	};
} else {
	assert(process.env.ELASTICSEARCH_API_KEY);
	auth = {
		apiKey: process.env.ELASTICSEARCH_API_KEY,
	};
}

assert(process.env.ELASTICSEARCH_ENDPOINTS);

export const client = new Client({
	nodes: process.env.ELASTICSEARCH_ENDPOINTS.split(","),
	auth,
});
