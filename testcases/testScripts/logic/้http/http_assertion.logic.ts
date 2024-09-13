import { expect } from 'chai';
import IndianReportLogic from '../report.logic';
import Formatter from '../../class/formatter.class';
import AssertionLogic from '../assertion.logic';
import { HttpResponse } from '../../interface/file_interface/http_file.model';
import Obj from '../../util/object.util';

class HttpAssertionLogic {
  static SubSet(actualRes: HttpResponse, expectRes: HttpResponse): void {
    if (!expectRes) return;
    const expectedBody = Formatter.Exec(expectRes.body);
    IndianReportLogic.AddTestStep({
      actualResult: {
        status: actualRes.status,
        body: actualRes.body,
      },
      expectedResult: {
        status: expectRes.status,
        body: expectedBody,
      },
    });
    if ('status' in expectRes) expect(actualRes.status).equal(expectRes.status);
    if ('body' in expectRes) AssertionLogic.SubSet(actualRes.body, expectedBody, '');
  }
  static DeepEqual(actualRes: HttpResponse, expectRes: HttpResponse): void {
    if (!expectRes) return
    if ("status" in expectRes) expect(actualRes.status).equal(expectRes.status)
    if ("body" in expectRes) expect(actualRes.body).deep.equal(Formatter.Exec(expectRes.body))
  }

  static Model(actualRes: HttpResponse, expectRes: HttpResponse) {
    AssertionLogic.SubSet(
      Obj.ReplaceObjVal(Obj.New(actualRes), 'keyexpected')
      , Obj.ReplaceObjVal(Obj.New(expectRes), 'keyexpected')
      , "")
  }
}

export default HttpAssertionLogic;
