import { estypes } from "@elastic/elasticsearch";

export type Entry = {
  id: string;
  document: string;
  text: string;
  translation: string;
  collection_lv1: string | null;
  collection_lv2: string | null;
  collection_lv3: string | null;
  uri: string | null;
  pronoun: string | null;
  author: string | null;
  dialect: string | null;
  dialect_lv1: string[] | null;
  dialect_lv2: string[] | null;
  dialect_lv3: string[] | null;
  published_at: string | null;
  recorded_at: string | null;
};

export type EntryAggregate = {
  pronoun: estypes.AggregationsFilterAggregate;
  author: estypes.AggregationsFilterAggregate;
  collection_lv1: estypes.AggregationsFilterAggregate;
  dialect_lv1: estypes.AggregationsFilterAggregate;
  dialect_lv2: estypes.AggregationsFilterAggregate;
  dialect_lv3: estypes.AggregationsFilterAggregate;
};
