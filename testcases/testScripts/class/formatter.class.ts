import FormatterLogic from '../logic/formatter.logic';
import StorageLogic from '../logic/storage.logic';
import StorageClass from './storage.class';

class Formatter {
  static Exec(v: any): any {
    if (typeof v === 'object' && v !== null) {
      if (Array.isArray(v)) return v.map(this.Exec);
    } else return this.Switch(v);
    return v;
  }
  static Switch(v: any): any {
    if (v !== 'string') return v;
    v = StorageLogic.RepStrVar(v);
    switch (true) {
      case StorageClass.has(v):
        return StorageClass.get(v);
      case v.startsWith('now()'):
        return FormatterLogic.Date(v);
      case v.startsWith('random.'):
        return FormatterLogic.Random(v);
      case v.startsWith('Math'):
        return FormatterLogic.Math(v);
      default:
        return v;
    }
  }
  static PathReplace(str: string, params: Record<string, any>) {
    if (typeof params === 'object') {
      for (const key in params) str = str.replace(new RegExp(key, 'g'), params[key]);
    } else throw new Error(`paramReplace object ไม่ถูกต้อง`);
    return str;
  }
}

export default Formatter;
