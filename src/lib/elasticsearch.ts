import { Client } from "@elastic/elasticsearch";
import assert from "assert";

assert(process.env.ELASTICSEARCH_ENDPOINTS);
assert(process.env.ELASTICSEARCH_USERNAME);
assert(process.env.ELASTICSEARCH_PASSWORD);

export const client = new Client({
  nodes: process.env.ELASTICSEARCH_ENDPOINTS.split(","),
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
});
