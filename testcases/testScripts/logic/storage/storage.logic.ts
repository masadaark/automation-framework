import StorageClass from '../../class/storage.class';

class StorageLogic {
  private static RegExps = [
    { regex: /\${([^}]+)}/g, slice: 2 },
    { regex: /{([^}]+)}/g, slice: 1 },
  ];
  static RepStrVar = (strInput: string): string => {
    this.RegExps.forEach((regexObj) => {
      strInput = this.ReplaceStrVarExec(strInput, regexObj.regex, regexObj.slice);
    });

    return strInput;
  };

  private static ReplaceStrVarExec(str: string, regex: RegExp, slice: number): string {
    const matches = str.match(regex);
    const isLog = str === 'Bearer {jwtToken}';

    if (matches) {
      let result = str;
      for (const match of matches) {
        const paramName = match.slice(slice, -1);
        const replacement = StorageClass.get(paramName);
        if (replacement !== undefined) result = result.replace(match, replacement);
      }
      return result;
    }
    return str;
  }

  static ObjPathVal(obj: any, path: string) {
    const pathArr: (string | number)[] = this.PathToArr(path);
    let result: any = obj;
    for (const key of pathArr) {
      if (result) result = result[key];
      else return undefined;
    }
    return result;
  }

  static PathToArr(path: string): (string | number)[] {
    const parts = path.split(/[.[\]]/g).filter((part) => part !== '');
    const result = new Array(parts.length);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      result[i] = /^\d+$/.test(part) ? parseInt(part) : part;
    }
    return result;
  }
}

export default StorageLogic;
