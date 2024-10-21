const numChars = '0123456789';
const charChars = 'abcdefghijklmnopqrstuvwxyz';
const allChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
const charDict: Record<string, string> = {
  num: numChars,
  char: charChars,
  all: allChars,
};

class StrU {
  static readonly MakeStr = (length: number, type: string = 'all'): string => {
    const characters = charDict[type.toLowerCase()] || allChars;
    const charactersLength = characters.length;
    let res = '';
    for (let i = 0; i < length; i++) {
      res += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return res;
  };
  static readonly MakeStrInt = (len: number): string => {
    return this.MakeStr(len, 'num');
  };
  static IsStrNum(val: any): boolean {
    if (typeof val !== 'string') return false;
    return /^-?\d+(\.\d+)?$/.test(val);
  }

  static MakeIdCard(): string {
    let res = numChars[Math.floor(Math.random() * 8) + 1];
    let sum = 0;
    for (let i = 1; i < 12; i++) {
      res += numChars[Math.floor(Math.random() * 10)];
      sum += parseInt(res[i]) * (13 - i);
    }
    res += numChars[(11 - (sum % 11)) % 10];
    return res;
  }

  static RemoveStr(strRaw: string, strRemove: string): string {
    const result: string[] = [];
    const removeLength = strRemove.length;
    const rawLength = strRaw.length;
    for (let i = 0; i < rawLength; i++) {
      let isMatch = true;
      for (let j = 0; j < removeLength; j++) {
        if (strRaw[i + j] !== strRemove[j]) {
          isMatch = false;
          break;
        }
      }
      if (!isMatch) result.push(strRaw[i]);
    }
    return result.join('');
  }
  static RemoveFirstLastChar(s: string): string {
    if (s.length <= 2) {
      return '';
    }
    return s.substring(1, s.length - 1);
  }

  static CleanString(s: string) {
    return s.replace(/[\n]+/g, '')
  }
  static RemoveQuotes(s: string) {
    if ((s.startsWith("\"") && s.endsWith("\""))
      || (s.startsWith("\'") && s.endsWith("\'"))) return this.RemoveFirstLastChar(s)
      return s
  }
}

export default StrU;
