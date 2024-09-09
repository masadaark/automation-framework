import { ITestStepHookParameter } from "@cucumber/cucumber";
import { afterStep, binding } from "cucumber-tsflow";
import { writeFile } from "fs";

@binding()
export class AfterHook {
    @afterStep()
    public afterStepHook(test:ITestStepHookParameter): void {

        writeFile("afterStepHook.json", JSON.stringify(test, null, 2), function (err) {
            if (err) return console.error(`เขียนทับ hook ไม่สำเร็จ err:`, err);
        });
    }

}