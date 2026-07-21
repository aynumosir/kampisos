export const toSingleSearchParam = (
	value: string | string[] | undefined,
): string | undefined => {
	if (!value) {
		return undefined;
	}
	return Array.isArray(value) ? value[0] : value;
};
