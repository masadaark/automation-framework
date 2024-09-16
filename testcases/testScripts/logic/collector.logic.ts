import TcClass from '../class/test_cases.class';
import FileReaderLogic from './file_reader.logic';

export default class CollectorLogic {
  static async JsonFile(file: string, type: number) {
    await FileReaderLogic.JsonPayload(file);
  }
}
