import Obj from '../util/object.util';
import Str from '../util/string.util';

class Validator {
  static Var(val: any): boolean {
    return val !== undefined && val !== null && val !== '' && !Obj.IsBlank(val);
  }
  static StrNum(val: string): number {
    if (Str.IsStrNum(val)) return Number(val);
    throw new Error(`${val} ควรเป็น Number`);
  }
}

export default Validator;
