import TcClass from '../class/test_cases.class';
import { EnumFilePath } from '../enum/file_path.enum';
import File from '../util/file.util';

export default class FileReaderLogic {
  static async JsonPayload(file: string) {
    return await File.readJson(`${EnumFilePath.PAYLOAD_FOLDER}/${TcClass.feature}/${file}`.replace(/\/\//g, ''));
  }
  static async ApiCollection(file: string) {
    return await File.readJson(`${EnumFilePath.PAYLOAD_FOLDER}/api/${file}`.replace(/\/\//g, ''));
  }
  static async PgSql(file: string) {
    return await File.readText(`${EnumFilePath.PAYLOAD_FOLDER}/sql/${file}`.replace(/\/\//g, ''));
  }
}
