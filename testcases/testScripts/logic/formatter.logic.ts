import dayjs, { Dayjs, ManipulateType, UnitType } from 'dayjs';
import Validator from './validator.logic';
import StrU from '../util/string.util';
import VFormatter from '../class/formatter.class';
import Big from 'big.js';
import { MathNotation } from '../enum/type.enum';

const regDate: RegExp = /\(([^)]+)\)/;

class FormatterLogic {
  static Random(val: string) {
    const matches = /random\.(\w+)(?:\((\w+)\))?/.exec(val);
    if (!matches) throw new Error('เกิดข้อผิดพลาด random. ระบุค่าไม่ถูกต้อง');
    const key: string = matches[1];
    const num: number = Validator.StrNum(matches[2] || '0');
    switch (true) {
      case /int/i.test(key):
        return StrU.MakeStrInt(num);
      case /idcard/i.test(key):
        return StrU.MakeIdCard();
      case /string/i.test(key) || /char/i.test(key):
        return StrU.MakeStr(num);
      case /phone/i.test(key) || /char/i.test(key):
        return '0' + StrU.MakeStr(9);
      default:
        return '';
    }
  }
  static Date(val: string): string {
    let resDate: Dayjs = dayjs();
    const keys: string[] = val.split('.');

    for (let i = 1; i < keys.length; i++) {
      let key = keys[i];
      const match = regDate.exec(key);
      if (match !== null) {
        const params: string[] = match[1].split(',');
        const unit: string = params[params.length - 1];
        const dayJsType: ManipulateType = unit as ManipulateType;
        if (key.startsWith('add')) resDate = resDate.add(Number(params[0]), dayJsType);
        else if (key.startsWith('endOf')) resDate = resDate.endOf(dayJsType);
        else if (key.startsWith('startOf')) resDate = resDate.startOf(dayJsType);
      }
    }
    return this.DateTo(keys[keys.length - 1], resDate);
  }
  static DateTo(lastKey: string, val: Dayjs): string {
    switch (lastKey) {
      case 'date()':
        return val.format('YYYY-MM-DD');
      case 'month()':
        return val.format('YYYY-MM');
      case 'year()':
        return val.format('YYYY');
      case 'day()':
        return String(val.date());
      case 'timeStamp()':
        return String(val.unix());
    }
    if (String(lastKey).startsWith('get')) {
      const match = regDate.exec(lastKey);
      if (match === null) return val.toISOString();
      return String(val.get(match[1] as UnitType));
    } else if (String(lastKey).startsWith('format(')) {
      const match = regDate.exec(lastKey);
      if (match === null) return val.toISOString();
      return String(val.format(match[1] as UnitType));
    } else if (String(lastKey).startsWith('formatLocate(')) {
      const match = regDate.exec(lastKey);
      if (match === null) return val.toISOString();
      const input = match[1].split(',');
      const locale = input[0].trim();
      const format = input[1].trim();
      dayjs.locale(locale);
      const result = dayjs(val.toISOString()).format(format);
      dayjs.locale('en');
      return result;
    }
    return val.toISOString();
  }
  static Math(val: string): number {
    const match = /Math\((.*?)\)/.exec(val.replace(' ', ''));
    if (match !== null) {
      const equation = match[1];
      return this.CalEquation(equation);
    }
    return 0;
  }
  static CalEquation(expression: string): number {
    const operators: string[] | null = expression.match(/[-+*/]/g);
    const values: (number | Big)[] = expression
      .split(/[-+*/]/)
      .map((val) => Number(VFormatter.Exec(val)) || Number(val));

    if (!operators || operators.length !== values.length - 1) {
      throw new Error('Invalid expression');
    }

    let i = 0;
    while (i < operators.length) {
      if (operators[i] === '*' || operators[i] === '/') {
        values[i] = this.Cal(values[i], values[i + 1], operators[i] as MathNotation);
        values.splice(i + 1, 1);
        operators.splice(i, 1);
      } else i++;
    }
    let finalVal: Big = Big(values[0]);

    for (let i = 0; i < operators.length; i++) {
      finalVal = this.Cal(finalVal, values[i + 1], operators[i] as MathNotation);
    }

    return Number(finalVal.round(2, Big.roundHalfUp));
  }
  static Cal(val1: number | Big, val2: number | Big, notation: MathNotation): Big {
    switch (notation) {
      case '+':
        return Big(val1).plus(val2);
      case '-':
        return Big(val1).minus(val2);
      case '*':
        return Big(val1).times(val2);
      case '/':
        if (val2 === 0) throw new Error('ไม่สามารถหาค่าที่หารด้วย 0 ได้');
        return Big(val1).div(val2);
      default:
        throw new Error('Math notation ไม่ถูกต้อง');
    }
  }
}

export default FormatterLogic;
