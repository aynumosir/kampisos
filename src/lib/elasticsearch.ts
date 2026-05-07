import { Client } from "@elastic/elasticsearch";
import assert from "assert";

assert(process.env.ELASTICSEARCH_ENDPOINTS);

let auth: ConstructorParameters<typeof Client>[0]["auth"];
if (process.env.ELASTICSEARCH_PASSWORD) {
  auth = {
    username: process.env.ELASTICSEARCH_USERNAME!,
    password: process.env.ELASTICSEARCH_PASSWORD!,
  };
} else {
  auth = {
    apiKey: process.env.ELASTICSEARCH_API_KEY!,
  };
}

export const client = new Client({
  nodes: process.env.ELASTICSEARCH_ENDPOINTS.split(","),
  auth,
});
