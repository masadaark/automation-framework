import _ from 'lodash';
import Str from './string.util';

class Obj {
  static IsBlank(val: any): boolean {
    if (this.IsObj(val)) return Object.keys(val).length === 0;
    return false;
  }
  static IsObj(val: any): boolean {
    return typeof val === 'object' && val !== null;
  }
  static ToString(val: any): string {
    try {
      return String(JSON.stringify(val));
    } catch (error) {
      return String(val);
    }
  }
  static New(rawObject: any): any {
    return _.cloneDeep(rawObject);
  }
  static FindInclude(array: {}[], key: string, searchValue: number): any {
    return _.find(array, (member: Record<string, any>) => _.includes(member[key], searchValue));
  }
  static Parse(val: any): any {
    if (Str.IsStrNum(val)) {
      return val;
    }
    try {
      const result = JSON.parse(val);
      return typeof result === 'object' ? result : val;
    } catch {
      return val;
    }
  }
  static CanParse(val: any): boolean {
    try {
      return typeof JSON.parse(val) === 'object';
    } catch (error) {
      return false;
    }
  }
}
export default Obj;
