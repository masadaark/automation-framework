import dayjs, { Dayjs } from 'dayjs';
import { Comparator } from '../enum/type.enum';
import TypeLogic from './type.logic';

const CompLogic = {
    StrIncludes(act: any, exp: string): boolean {
        return String(act).includes(exp)
    },
    Numb(act: any, exp: number, comp: Comparator): boolean {
        comp = comp.toLowerCase() as Comparator
        const actNum: number = Number(act)
        exp = Number(exp)
        switch (comp) {
            case "lessthan":
                return actNum < exp
            case "morethan":
                return actNum > exp
            case "lessthanorequal":
                return actNum <= exp
            case "morethanorequal":
                return actNum >= exp
            default:
                return actNum === exp
        }
    },
    Flag(act: any, exp: any, comp: Comparator): boolean {
        comp = comp.toLowerCase() as Comparator
        switch (TypeLogic.Type(exp)) {
            case "date":
            case "dateTime":
                return CompLogic.Date(act, exp, comp)
            case "number":
                return CompLogic.Numb(act, exp, comp)
            case "string":
            default:
                if (comp === "include") return CompLogic.StrIncludes(act, exp)
                return String(act) === exp
        }
    },
    Date(act: any, exp: any, comp: Comparator): boolean {
        comp = comp.toLowerCase() as Comparator
        const actD: Dayjs = dayjs(act)
        const expD: Dayjs = dayjs(exp)
        switch (comp) {
            case "lessthan":
                return actD.isBefore(expD)
            case "morethan":
                return actD.isAfter(expD)
            case "lessthanorequal":
                return actD.isSame(expD) ?? actD.isBefore(expD)
            case "morethanorequal":
                return actD.isSame(expD) ?? actD.isAfter(expD)
            default:
                return actD.isSame(expD)
        }
    }
}

export default CompLogic