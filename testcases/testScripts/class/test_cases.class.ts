import { PgDBFileModel } from '../interface/file_interface/db_file.model';
import { HttpFileModel } from '../interface/file_interface/http_file.model';

const TcClass = {
  feature: '',
  tcNo: 0,
  PgDBFile: undefined as PgDBFileModel | undefined,
  HttpFile: undefined as HttpFileModel | undefined,

  reset() {
    this.PgDBFile = undefined;
    this.HttpFile = undefined;
  },
};

export default TcClass;
