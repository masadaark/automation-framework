import { ITestStepHookParameter } from '@cucumber/cucumber';
import { after, afterAll, afterStep, binding } from 'cucumber-tsflow';
import IndianReportClass from '../class/report.class';
import IndianReportLogic from '../logic/report.logic';
import FileU from '../util/file.util';
import { EnumFilePath } from '../enum/file_path.enum';
import Big from 'big.js';
import WiremockLogic from '../logic/mock/wiremock.logic';
import dayjs from 'dayjs';

@binding()
export class AfterHook {
  @afterStep()
  public afterStepHook(afterStepHook: ITestStepHookParameter): void {
    const testStatus = afterStepHook.result.status;
    const timStamp = Big(afterStepHook.result.duration.nanos).div(1000000).toNumber();
    console.warn(`---STATUS: ${testStatus} TIMESTAMP(milisec): ${timStamp}`);
    const errorMessage = afterStepHook.result.exception?.message;
    if (errorMessage) IndianReportLogic.AddTestStep(errorMessage);
    IndianReportLogic.AddTestStepResult(timStamp, testStatus);
  }
  @afterAll()
  public async afterAllHook(): Promise<void> {
    console.warn('\n');
    console.warn('******Writing Report******');
    const reportData = IndianReportClass.toReport();
    if (reportData?.overview?.ran) {
      const reportName = `${EnumFilePath.REPORT_PATH}/test-result-report-${dayjs().valueOf()}.json`;
      console.warn('reportName', reportName);
      await FileU.writeJson(reportName, reportData);
    }
  }
  @after()
  public afterEachHook(): void {
    if (WiremockLogic.flagClear) WiremockLogic.ClearMappingUUIDs();
    WiremockLogic.flagClear = true;
  }
}
