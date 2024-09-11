import { expect } from 'chai';
import IndianReportLogic from '../report.logic';
import Formatter from '../../class/formatter.class';
import AssertionLogic from '../assertion.logic';
import { HttpResponse } from '../../interface/file_interface/http_file.model';

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
}

export default HttpAssertionLogic;
