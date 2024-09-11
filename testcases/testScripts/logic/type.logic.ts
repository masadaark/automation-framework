import { ValueType } from "../enum/type.enum"
import DateU from "../util/date.util"
import Obj from "../util/object.util"
import Str from "../util/string.util"

const TypeLogic = {
    Type(val: any): ValueType {
        if (val === null) return "null"
        if (typeof val === "boolean") return "boolean"
        if (typeof val === 'number' || Str.IsStrNum(val)) return "number"
        if (DateU.IsDateStr(val)) return "date"
        else if (DateU.IsDateTimeStr(val)) return "dateTime"
        else if (/keyexpected/i.test(val)) return "key"
        else if (Obj.CanParse(val)) return 'json'
        return "string"
    }
}

export default TypeLogic