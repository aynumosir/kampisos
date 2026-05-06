import { estypes } from "@elastic/elasticsearch";
import { Section } from "@radix-ui/themes";
import { FC, use } from "react";

import { Paginator } from "@/components/Paginator";
import { EntryHit } from "@/models/entry";

export type ResultProps = {
  size: number;
  page: number;
  resultPromise: Promise<estypes.SearchResponse<EntryHit>>;
};

export const FooterContent: FC<ResultProps> = (props) => {
  const { size, page, resultPromise } = props;
  const result = use(resultPromise);

  // TODO: Simplify this code
  const total =
    result.hits.total && typeof result.hits.total !== "number"
      ? result.hits.total.value
      : null;

  if (total == null || total <= 0) {
    return null;
  }

  const totalPages = Math.ceil(total / size);
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <Section size="1">
      <footer>
        <Paginator page={page} totalPages={totalPages} />
      </footer>
    </Section>
  );
};
