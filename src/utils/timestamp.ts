import dayjs, { type Dayjs } from "@/lib/dayjs";

type DateOrRange =
	| { type: "point"; value: Dayjs }
	| { type: "range"; start: Dayjs; end: Dayjs };

const parseDateOrRange = (dateOrRange: string): DateOrRange => {
	if (dateOrRange.includes("/")) {
		const [start, end] = dateOrRange.split("/");

		return {
			type: "range",
			start: dayjs(start),
			end: dayjs(end),
		};
	} else {
		return {
			type: "point",
			value: dayjs(dateOrRange),
		};
	}
};

// --------------

export const formatDateOrRange = (value: string, template: string): string => {
	const dateOrRange = parseDateOrRange(value);

	if (dateOrRange.type === "range") {
		const range = dateOrRange;

		const start = dayjs(range.start);
		const end = dayjs(range.end);

		if (start.year !== end.year) {
			return `${start.format(template)}—${end.format(template)}`;
		} else {
			return start.format(template);
		}
	} else {
		const date = dayjs(dateOrRange.value);
		return date.format(template);
	}
};
