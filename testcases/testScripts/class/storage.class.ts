import IndianReportLogic from '../logic/report.logic';
import StorageLogic from '../logic/storage.logic';
import Obj from '../util/object.util';
import EnvClass from './env.class';
import Formatter from './formatter.class';

class StorageClass {
  private static _vals: Record<string, any> = {};

  static add(key: string, val: any, log = true): void {
    const valSet: any = Formatter.Exec(val);
    const logSetVar = `**Store ${key} : Val ${Obj.ToString(valSet)}**`;
    if (log) console.warn(logSetVar);
    IndianReportLogic.AddTestStep(logSetVar);
    this._vals[key] = valSet;
  }

  static get(key: string): any {
    if (EnvClass.has(key)) return EnvClass.get(key);
    const keyPath = StorageLogic.PathToArr(String(key));
    const val = this._vals[keyPath[0]];
    if (keyPath.length === 1) return val;
    return StorageLogic.ObjPathVal(val, keyPath.slice(1).join('.'));
  }

  static has(key: string): boolean {
    const keySearch = StorageLogic.PathToArr(String(key))[0];
    return keySearch in this._vals || EnvClass.has(key);
  }

  static getAll(): {} {
    return this._vals;
  }

  static reset(): void {
    this._vals = {};
  }
}

export default StorageClass;
