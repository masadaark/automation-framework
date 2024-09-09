import { beforeAll, beforeStep, binding } from "cucumber-tsflow";
import IndianReportClass from "../class/report.class";
import { ITestStepHookParameter } from "@cucumber/cucumber";
import fs from 'fs';
import { EnumFilePath } from "../enum/file_path.enum";
import Cfg from '../class/config.class';
import { AppSettingModel } from "../interface/app_setting.model";

@binding()
export class BeforeHook {
    @beforeAll()
    public async beforeAllHook(): Promise<void> {
        const appSettingPath = EnumFilePath.APP_SETTING;
        console.warn(`******READ_FILE: ${appSettingPath}******`);
        return new Promise((resolve, reject) => {
            fs.readFile(appSettingPath, 'utf8', (err, data) => {
                if (err) return reject(new Error("อ่านไฟล์ app-setting.json ไม่สำเร็จ"));
                Cfg.appSetting = JSON.parse(data) as AppSettingModel;
                resolve();
            });
        });
    }
    @beforeStep()
    public beforeStepHook(testStepHook: ITestStepHookParameter): void {
        IndianReportClass.testStepHook = testStepHook
    }
}