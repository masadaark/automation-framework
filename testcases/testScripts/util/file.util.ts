import fs from 'fs/promises';
import mime from 'mime-types';



class FileU {
  private static errorMessage(filePath: string, err: any): string {
    return `อ่านไฟล์ ${filePath} ไม่สำเร็จ err:${err}`;
  }
  static async readJson(filePath: string): Promise<any> {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      throw new Error(this.errorMessage(filePath, err));
    }
  }
  static async writeJson(filePath: string, jsonData: object): Promise<void> {
    try {
      const data = JSON.stringify(jsonData, null, 2);
      await fs.writeFile(filePath, data, 'utf8');
    } catch (err) {
      throw new Error(this.errorMessage(filePath, err));
    }
  }

  static async readText(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch {
      try {
        const fileType = mime.lookup(filePath) ?? ""
        return await fs.readFile(`${filePath}.${String(fileType).split('/')[1]}`, 'utf8');
      } catch (err) {
        throw new Error(this.errorMessage(filePath, err));
      }
    }
  }

  static async writeText(filePath: string, text: string): Promise<void> {
    try {
      await fs.writeFile(filePath, text, 'utf8');
    } catch (err) {
      throw new Error(this.errorMessage(filePath, err));
    }
  }
}

export default FileU;
