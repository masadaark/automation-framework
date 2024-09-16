import TcClass from '../class/test_cases.class';
import { EnumFilePath } from '../enum/file_path.enum';
import File from '../util/file.util';

export default class FileReaderLogic {
  private static defaultFileType(file: string, type: string = 'json') {
    const fileArr = file.replace(/\/\//g, '').split('.');
    if (fileArr.length === 1) fileArr.push(type);
    return fileArr.join('.');
  }
  static async JsonPayload(file: string) {
    return await File.readJson(
      `${EnumFilePath.PAYLOAD_FOLDER}/features/${TcClass.feature}/${this.defaultFileType(file)}`
    );
  }
  static async ApiCollection(file: string) {
    return await File.readJson(`${EnumFilePath.PAYLOAD_FOLDER}/api/${this.defaultFileType(file)}`);
  }
  static async PgSql(file: string) {
    try {
      return await File.readText(`${EnumFilePath.PAYLOAD_FOLDER}/sql/${this.defaultFileType(file, 'txt')}`);
    } catch {
      return await File.readText(`${EnumFilePath.PAYLOAD_FOLDER}/sql/${this.defaultFileType(file, 'sql')}`);
    }
  }
}
