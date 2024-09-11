import { DBFile } from '../interface/file_interface/db_file.model';
import { HttpFile } from '../interface/file_interface/http_file.model';

const TcClass = {
  feature: '',
  tcNo: 0,
  DBFile: undefined as DBFile | undefined,
  HttpFile: undefined as HttpFile | undefined,

  reset() {
    this.DBFile = undefined;
    this.HttpFile = undefined;
  },
};

export default TcClass;
