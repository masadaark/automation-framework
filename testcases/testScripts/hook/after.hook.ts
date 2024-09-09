import { ITestStepHookParameter } from "@cucumber/cucumber";
import { afterAll, afterStep, binding } from "cucumber-tsflow";
import { writeFile } from "fs";
import IndianReportClass from "../class/report.class";

@binding()
export class AfterHook {
    @afterStep()
    public afterStepHook(test: ITestStepHookParameter): void {

        writeFile("afterStepHook.json", JSON.stringify(test, null, 2), function (err) {
            if (err) return console.error(`เขียนทับ hook ไม่สำเร็จ err:`, err);
        });
    }
    @afterAll()
    public afterAllHook(): void {
        console.log("******Writing Report******")
        writeFile("manual_report.json", JSON.stringify(IndianReportClass.toReport(), null, 2), function (err) {
            if (err) return console.error(`เขียนทับ hook ไม่สำเร็จ err:`, err);
        });
    }

}