import _ from 'lodash';
import StrU from './string.util';
import Papa from 'papaparse';

class Obj {
  static IsBlank(val: any): boolean {
    if (this.IsObj(val)) return Object.keys(val).length === 0;
    return false;
  }
  static IsObj(val: any): boolean {
    return typeof val === 'object' && val !== null;
  }
  static ToString(val: any): string {
    if (typeof val === 'object' && val !== null) return StrU.CleanString(String(JSON.stringify(val)));
    return String(val);
  }
  static Merge(raw: Record<string, any>, added: Record<string, any>) {
    for (const key in added) {
      if (!(key in raw)) raw[key] = added[key];
    }
    return raw;
  }
  static New(rawObject: any): any {
    return _.cloneDeep(rawObject);
  }
  static FindInclude(array: {}[], key: string, searchValue: number): any {
    return _.find(array, (member: Record<string, any>) => _.includes(member[key], searchValue));
  }
  static Parse(val: any): any {
    if (StrU.IsStrNum(val)) {
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
  static ArrToObj(arr2D: any[][]): Record<string, any>[] {
    const cols: string[] = arr2D[0];
    const objArr: Record<string, any>[] = [];
    for (let i = 1; i < arr2D.length; i++) {
      const row: Record<string, any> = {};
      for (let ic = 0; ic < cols.length; ic++) {
        const val = arr2D[i][ic];
        row[cols[ic]] = this.Parse(val);
      }
      objArr.push(this.New(row));
    }
    return objArr;
  }
  static ReplaceObjVal(obj: any, val: any): any {
    if (obj === null || typeof obj !== 'object') {
      return val;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => this.ReplaceObjVal(item, val));
    }
    for (const [key, value] of Object.entries(obj)) {
      obj[key] = this.ReplaceObjVal(value, val);
    }
    return obj;
  }
  static DeepKeyVal(obj: any, searchKey: string): any[] {
    let v: any[] = [];
    function search(obj: any) {
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          if (searchKey === key) v.push(obj[key]);
          else search(obj[key]);
        }
      }
    }
    search(obj);
    return v;
  }
  static CSVtoJSON(csv: string) {
    if (StrU.IsStrNum(csv)) return csv;
    try {
      return Papa.parse(csv, {
        header: true,
        complete: function (results) {
          const jsonString = JSON.stringify(results.data);
          return JSON.parse(jsonString);
        },
      }).data;
    } catch {
      return csv;
    }
  }
}
export default Obj;
