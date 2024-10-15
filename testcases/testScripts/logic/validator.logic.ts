import Obj from '../util/object.util';
import StrU from '../util/string.util';

class Validator {
  private static LogicOperatorList = ['and', 'or', 'not'];
  private static LogicOperatorSet = new Set(this.LogicOperatorList);
  static Var(val: any): boolean {
    return val !== undefined && val !== null && val !== '' && !Obj.IsBlank(val);
  }
  static StrNum(val: string): number {
    if (StrU.IsStrNum(val)) return Number(val);
    throw new Error(`${val} ควรเป็น Number`);
  }

  static LogicOperator(v: string): void {
    if (!this.LogicOperatorSet.has(v))
      throw new Error(`Operator ไม่ถูกต้อง ${v} (${this.LogicOperatorList.join(',')})`);
  }
}

export default Validator;
