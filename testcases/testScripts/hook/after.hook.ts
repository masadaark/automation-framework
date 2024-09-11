import { ITestStepHookParameter } from "@cucumber/cucumber";
import { afterAll, afterStep, binding } from "cucumber-tsflow";
import IndianReportClass from "../class/report.class";
import IndianReportLogic from "../logic/report.logic";
import File from '../util/file.util';
import { EnumFilePath } from "../enum/file_path.enum";

@binding()
export class AfterHook {
    @afterStep()
    public afterStepHook(afterStepHook: ITestStepHookParameter): void {
        const testStatus = afterStepHook.result.status
        console.warn(`---STATUS: ${testStatus}`)
        IndianReportLogic.AddTestStepResult(afterStepHook.result.duration.nanos, testStatus)
    }
    @afterAll()
    public afterAllHook(): void {
        console.warn("\n")
        console.warn("******Writing Report******")
        File.writeJson(EnumFilePath.REPORT_PATH, IndianReportClass.toReport())
    }

}