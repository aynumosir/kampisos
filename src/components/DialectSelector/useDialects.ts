import { useDialectFormatter } from "@/hooks/useDialectFormatter";

export type Dialect = {
	label: string;
	value: string;
	children?: Dialect[];
};

export const useDialects = (): Dialect[] => {
	const format = useDialectFormatter();

	const dialects: Dialect[] = [
		{
			label: format("樺太"),
			value: "樺太",
			children: [
				{
					label: format("樺太/西海岸"),
					value: "樺太/西海岸",
					children: [
						{
							label: format("樺太/西海岸/小田洲"),
							value: "樺太/西海岸/小田洲",
						},
						{
							label: format("樺太/西海岸/鵜城"),
							value: "樺太/西海岸/鵜城",
						},
						{
							label: format("樺太/西海岸/来知志"),
							value: "樺太/西海岸/来知志",
						},
					],
				},
			],
		},
		{
			label: format("北海道"),
			value: "北海道",
			children: [
				{
					label: format("北海道/南西"),
					value: "北海道/南西",
					children: [
						{ label: format("北海道/南西/沙流"), value: "北海道/南西/沙流" },
						{ label: format("北海道/南西/千歳"), value: "北海道/南西/千歳" },
						{ label: format("北海道/南西/鵡川"), value: "北海道/南西/鵡川" },
						{ label: format("北海道/南西/幌別"), value: "北海道/南西/幌別" },
						{ label: format("北海道/南西/虻田"), value: "北海道/南西/虻田" },
						{ label: format("北海道/南西/白老"), value: "北海道/南西/白老" },
					],
				},
				{
					label: format("北海道/北東"),
					value: "北海道/北東",
					children: [
						{ label: format("北海道/北東/静内"), value: "北海道/北東/静内" },
						{ label: format("北海道/北東/石狩"), value: "北海道/北東/石狩" },
						{ label: format("北海道/北東/白糠"), value: "北海道/北東/白糠" },
						{ label: format("北海道/北東/十勝"), value: "北海道/北東/十勝" },
						{ label: format("北海道/北東/釧路"), value: "北海道/北東/釧路" },
						{ label: format("北海道/北東/浦河"), value: "北海道/北東/浦河" },
						{ label: format("北海道/北東/美幌"), value: "北海道/北東/美幌" },
						{ label: format("北海道/北東/様似"), value: "北海道/北東/様似" },
					],
				},
			],
		},
	];

	return dialects;
};
