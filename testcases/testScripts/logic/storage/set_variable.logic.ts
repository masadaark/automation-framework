import VFormatter from '../../class/formatter.class';
import StorageClass from '../../class/storage.class';
import TcClass from '../../class/test_cases.class';
import { SetVarFile } from '../../interface/file_interface/sotrage.model';
import FileU from '../../util/file.util';
import Obj from '../../util/object.util';
import FileReaderLogic from '../file_reader.logic';
import IndianReportLogic from '../report.logic';
import Validator from '../validator.logic';

export default class SetVarLogic {
  static async JsonFile(file: string) {
    const setVarFile = await FileReaderLogic.JsonPayload(file);
    const setvarData: SetVarFile = Array.isArray(setVarFile)
      ? setVarFile.find((o) => o.tcNo.includes(TcClass.tcNo))
      : (setVarFile as SetVarFile);
    if (Validator.Var(setvarData) && setvarData?.tcNo?.includes(TcClass.tcNo)) {
      for (const key in setvarData.variables) {
        this.DataSetter(key, setvarData?.variables[key]);
      }
    }
  }
  static async DataSetter(key: string, variable: any) {
    if (typeof variable === 'string' && variable.startsWith('equalToFile')) this.FileSetter(key, variable);
    else StorageClass.add(key, VFormatter.Exec(Obj.Parse(variable)));
  }

  static async FileSetter(key: string, filePathFormat: string) {
    filePathFormat = filePathFormat.replace(' ', '');
    const match = /equalToFile\((.*?)\)/i.exec(filePathFormat);
    if (match !== null) {
      const filePath = match[1];
      const fileContent = FileU.readText(filePath);
      if (typeof fileContent === 'string') {
        const match = /.to\((.*?)\)/i.exec(filePathFormat);
        if (match === null) StorageClass.add(key, fileContent);
        else StorageClass.add(key, SetVarLogic.FormatFileData(filePath, fileContent, match[1]));
      } else StorageClass.add(key, fileContent);
    } else IndianReportLogic.AddTestStep(`** Path ไม่ถูกต้อง ${filePathFormat} ** `)
  }
  static FormatFileData(filePath: string, data: string, type: string) {
    if (/json/i.test(type)) {
      if (filePath.endsWith('.csv')) return Obj.CSVtoJSON(data);
      else return VFormatter.Exec(Obj.Parse(data));
    }
    return data;
  }
}
