export type Pages = {
	value: number[];
	hasMore: {
		leading: boolean;
		trailing: boolean;
	};
};

export const createPages = (
	current: number,
	total: number,
	maxToShow: number,
): Pages => {
	const pages = Array.from({ length: total }, (_, i) => i);

	if (total <= maxToShow) {
		return {
			value: pages,
			hasMore: {
				leading: false,
				trailing: false,
			},
		};
	}

	const start = Math.max(0, current - Math.floor(maxToShow / 2));
	const end = Math.min(total, start + maxToShow);

	return {
		value: pages.slice(start, end),
		hasMore: {
			leading: start > 0,
			trailing: end < total,
		},
	};
};
