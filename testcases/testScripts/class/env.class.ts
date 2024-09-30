import StorageLogic from '../logic/storage/storage.logic';
import VFormatter from './formatter.class';

class EnvClass {
  static _vals: Record<string, any> = {};

  static isSetUp(): boolean {
    return Object.keys(this._vals).length > 3;
  }

  static add(key: string, val: any): void {
    const valSet: any = VFormatter.Exec(val);
    // if (log) console.warn(`**Env Set ${key} : Val ${Obj.ToString(valSet)}**`);
    this._vals[key] = valSet;
  }

  static get(key: string): any {
    const keyPath = StorageLogic.PathToArr(String(key));
    const val = this._vals[keyPath[0]];
    if (keyPath.length === 1) return val;
    return StorageLogic.ObjPathVal(val, keyPath.slice(1).join('.'));
  }

  static has(key: string): boolean {
    return StorageLogic.PathToArr(String(key))[0] in this._vals;
  }

  static getAll(): {} {
    return this._vals;
  }
}

export default EnvClass;
