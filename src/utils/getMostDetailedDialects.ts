export const getMostDetailedDialects = (
	lv1: string[],
	lv2: string[],
	lv3: string[],
): string[] => {
	const dialects: string[] = [];

	for (const d1 of lv1) {
		if (lv2.some((d2) => d2.startsWith(d1))) {
			continue;
		}

		dialects.push(d1);
	}

	for (const d2 of lv2) {
		if (lv3.some((d3) => d3.startsWith(d2))) {
			continue;
		}

		dialects.push(d2);
	}

	dialects.push(...lv3);

	dialects.sort();

	return dialects;
};
