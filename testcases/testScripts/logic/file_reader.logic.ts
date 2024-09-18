import TcClass from '../class/test_cases.class';
import { EnumFilePath } from '../enum/file_path.enum';
import FileU from '../util/file.util';

export default class FileReaderLogic {
  private static defaultFileType(file: string, type: string = 'json') {
    const fileArr = file.replace(/\/\//g, '').split('.');
    if (fileArr.length === 1) fileArr.push(type);
    return fileArr.join('.');
  }
  static async JsonPayload(file: string) {
    return await FileU.readJson(
      `${EnumFilePath.PAYLOAD_FOLDER}/features/${TcClass.feature}/${this.defaultFileType(file)}`
    );
  }
  static async ReadText(file: string) {
    return await FileU.readText(
      `${EnumFilePath.PAYLOAD_FOLDER}/features/${TcClass.feature}/${this.defaultFileType(file)}`
    );
  }
  static async ApiCollection(file: string) {
    return await FileU.readJson(`${EnumFilePath.PAYLOAD_FOLDER}/api/${this.defaultFileType(file)}`);
  }
  static async PgSql(file: string) {
    try {
      return await FileU.readText(`${EnumFilePath.PAYLOAD_FOLDER}/sql/${this.defaultFileType(file, 'txt')}`);
    } catch {
      return await FileU.readText(`${EnumFilePath.PAYLOAD_FOLDER}/sql/${this.defaultFileType(file, 'sql')}`);
    }
  }
  static async ReadWiremockCollection(file: string) {
    return await FileU.readJson(`${EnumFilePath.PAYLOAD_FOLDER}/wiremock/${file} `)
  }
}
