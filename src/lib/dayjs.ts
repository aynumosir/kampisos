import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

import "dayjs/locale/ja";
import "./dayjs-ain-kana";
import "./dayjs-ain-latn";

export default dayjs;
export { Dayjs } from "dayjs";
