import { useTranslations } from "next-intl";
import { useCallback } from "react";

type UseDialectFormatterOutput = (dialect: string) => string;

export const useDialectFormatter = (): UseDialectFormatterOutput => {
	const t = useTranslations("/hooks/useDialectFormatter");

	const formatter = useCallback(
		(dialect: string) => {
			switch (dialect) {
				case "樺太":
					return t("karahuto");
				case "樺太/西海岸":
					return t("east_coast");
				case "樺太/西海岸/小田洲":
					return t("otasu");
				case "樺太/西海岸/鵜城":
					return t("ushiro");
				case "樺太/西海岸/来知志":
					return t("raichishi");

				case "北海道":
					return t("hokkaido");
				case "北海道/南西":
					return t("southwest");
				case "北海道/南西/沙流":
					return t("saru");
				case "北海道/南西/千歳":
					return t("chitose");
				case "北海道/南西/鵡川":
					return t("mukawa");
				case "北海道/南西/幌別":
					return t("horobetsu");
				case "北海道/南西/虻田":
					return t("abuta");
				case "北海道/南西/白老":
					return t("shiraoi");

				case "北海道/北東/静内":
					return t("shizunai");
				case "北海道/北東/石狩":
					return t("ishikari");
				case "北海道/北東/白糠":
					return t("shiranuka");
				case "北海道/北東/十勝":
					return t("tokachi");
				case "北海道/北東/釧路":
					return t("kushiro");
				case "北海道/北東/浦河":
					return t("urakawa");
				case "北海道/北東/美幌":
					return t("bihoro");
				case "北海道/北東/様似":
					return t("samani");

				case "北海道/北東":
					return t("northeast");
				default:
					return dialect;
			}
		},
		[t],
	);

	return formatter;
};
