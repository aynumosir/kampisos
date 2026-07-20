import type { estypes } from "@elastic/elasticsearch";
import { Section } from "@radix-ui/themes";
import { type FC, use } from "react";

import { Paginator } from "@/components/Paginator";
import { getTotalHits } from "@/lib/elasticsearch-helper";
import type { EntryAggregate, EntryHit } from "@/models/entry";

export type ResultProps = {
	size: number;
	page: number;
	searchResponsePromise: Promise<
		estypes.SearchResponse<EntryHit, EntryAggregate>
	>;
};

export const FooterContent: FC<ResultProps> = (props) => {
	const { size, page, searchResponsePromise: resultPromise } = props;
	const result = use(resultPromise);

	const total = getTotalHits(result);
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
