import { ITestStepHookParameter } from "@cucumber/cucumber";
import { afterAll, afterStep, binding } from "cucumber-tsflow";
import IndianReportClass from "../class/report.class";
import IndianReportLogic from "../logic/report.logic";
import File from '../util/file.util';
import { EnumFilePath } from "../enum/file_path.enum";
import Big from "big.js";

@binding()
export class AfterHook {
    @afterStep()
    public afterStepHook(afterStepHook: ITestStepHookParameter): void {
        const testStatus = afterStepHook.result.status
        const timStamp = Big(afterStepHook.result.duration.nanos).div(1000000).toNumber()
        console.warn(`---STATUS: ${testStatus} TIMESTAMP(milisec): ${timStamp}`)
        const errorMessage = afterStepHook.result.exception?.message
        if(errorMessage) IndianReportLogic.AddTestStep(errorMessage)
        IndianReportLogic.AddTestStepResult(timStamp, testStatus)
    }
    @afterAll()
    public afterAllHook(): void {
        console.warn("\n")
        console.warn("******Writing Report******")
        File.writeJson(EnumFilePath.REPORT_PATH, IndianReportClass.toReport())
    }

}