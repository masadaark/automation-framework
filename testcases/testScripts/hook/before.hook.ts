import { beforeAll, beforeStep, binding } from 'cucumber-tsflow';
import IndianReportClass from '../class/report.class';
import { ITestStepHookParameter } from '@cucumber/cucumber';
import { EnumFilePath } from '../enum/file_path.enum';
import Cfg from '../class/config.class';
import { AppSettingModel } from '../interface/app_setting.model';
import FileU from '../util/file.util';
import ProtocolPg from '../protocol/pg.protocol';
import WiremockLogic from '../logic/mock/wiremock.logic';
import { ProtocolMongoDB } from '../protocol/mongodb.protocol';
import ProtocolHttp from '../protocol/http.protocol';
import AwsLogic from '../logic/aws/aws_s3.logic';
let scenarioId: string = '';
// let testStepId: string = '';
@binding()
export class BeforeHook {
  @beforeAll()
  public async beforeAllHook(): Promise<void> {
    const appSettingPath = EnumFilePath.APP_SETTING;
    console.warn(`******READ_FILE: ${appSettingPath}******`);
    const appSettingFile = await FileU.readJson(appSettingPath);
    Cfg.appSetting = appSettingFile as AppSettingModel;
    await WiremockLogic.InitWiremockUrl(Cfg.appSetting);
    AwsLogic.Init(Cfg.appSetting);
    ProtocolHttp.Init(Cfg.appSetting);
    ProtocolMongoDB.Init(Cfg.appSetting.mongoDB);
    ProtocolPg.Connect(Cfg.appSetting.pgDB);
  }
  @beforeStep()
  public beforeStepHook(testStepHook: ITestStepHookParameter): void {
    if (scenarioId !== testStepHook.pickle.id) {
      console.warn(`\n`);
      scenarioId = testStepHook.pickle.id;
      console.warn(`-SCENARIO: ${testStepHook.pickle.name}`);
    }
    // if (testStepId !== testStepHook.pickleStep.id) {
    //   testStepId = testStepHook.pickleStep.id;
    //   console.warn(`--TEST STEP: ${testStepHook.pickleStep.text}`);
    // }
    IndianReportClass.testStepHook = testStepHook;
  }
}
