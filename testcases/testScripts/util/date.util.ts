import dayjs, { Dayjs, OpUnitType } from "dayjs";
import Str from "./string.util";

class DateU {
    private static dateUnits: OpUnitType[] = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond'];
    static IsDateStr(val: string): boolean {
        const parsedD: Dayjs = dayjs(val, "YYYY-MM-DD", true)
        return parsedD.isValid() && parsedD.format('YYYY-MM-DD') === val;
    }
    static IsDateTimeStr(val: string): boolean {
        if(typeof val !== "string") return false
        return Str.IsStrNum(`${val[0]}`) && dayjs(val).isValid()
    }
    static ToDate(val: string | Dayjs): string {
        return dayjs(val).format("YYYY-MM-DD")
    }
    static ToDateTime(val: string | Dayjs): string {
        return dayjs(val).toISOString()
    }
}

export default DateU