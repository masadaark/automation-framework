import { beforeAll, beforeStep, binding } from 'cucumber-tsflow';
import IndianReportClass from '../class/report.class';
import { ITestStepHookParameter } from '@cucumber/cucumber';
import { EnumFilePath } from '../enum/file_path.enum';
import Cfg from '../class/config.class';
import { AppSettingModel } from '../interface/app_setting.model';
import File from '../util/file.util';
let scenarioId: string = '';
let testStepId: string = '';
@binding()
export class BeforeHook {
  @beforeAll()
  public async beforeAllHook(): Promise<void> {
    const appSettingPath = EnumFilePath.APP_SETTING;
    console.warn(`******READ_FILE: ${appSettingPath}******`);
    const appSettingFile = await File.readJson(appSettingPath);
    Cfg.appSetting = appSettingFile as AppSettingModel;
    if (Cfg.appSetting.baseUrl?.endsWith('/')) Cfg.appSetting.baseUrl = Cfg.appSetting.baseUrl.slice(0, -1);
    return;
  }
  @beforeStep()
  public beforeStepHook(testStepHook: ITestStepHookParameter): void {
    if (scenarioId !== testStepHook.pickle.id) {
      console.warn(`\n`);
      scenarioId = testStepHook.pickle.id;
      console.warn(`-SCENARIO: ${testStepHook.pickle.name}`);
    }
    if (testStepId !== testStepHook.pickleStep.id) {
      testStepId = testStepHook.pickleStep.id;
      console.warn(`--TEST STEP: ${testStepHook.pickleStep.text}`);
    }
    IndianReportClass.testStepHook = testStepHook;
  }
}
