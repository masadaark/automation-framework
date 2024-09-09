import { ITestStepHookParameter } from "@cucumber/cucumber";
import { beforeStep, binding } from "cucumber-tsflow";
import { writeFile } from "fs";

@binding()
export class BeforeHook {
    @beforeStep()
    public beforeStepHook(test:ITestStepHookParameter): void {
        writeFile("beforeStepHook.json", JSON.stringify(test, null, 2), function (err) {
            if (err) return console.error(`เขียนทับ hook ไม่สำเร็จ err:`, err);
        });
    }

}