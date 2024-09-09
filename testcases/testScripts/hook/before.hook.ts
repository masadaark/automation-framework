import { beforeAll, beforeStep, binding } from "cucumber-tsflow";
import IndianReportClass from "../class/report.class";
import { ITestStepHookParameter } from "@cucumber/cucumber";
import fs from 'fs';
import { EnumFilePath } from "../enum/file_path.enum";

@binding()
export class BeforeHook {
    @beforeAll()
    public beforeAllHook(): void {
        const appSettingPath = EnumFilePath.APP_SETTING
        console.warn(`******READ_FILE: ${appSettingPath}******`)
        fs.readFile(appSettingPath, 'utf8', (err, data) => {
            if (err) throw new Error("อ่าน app-setting.json ไม่สำเร็จ") 
            console.warn(data)
        })
    }
    @beforeStep()
    public beforeStepHook(testStepHook: ITestStepHookParameter): void {
        IndianReportClass.testStepHook = testStepHook
    }
}