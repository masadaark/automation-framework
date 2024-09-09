import { ITestStepHookParameter } from "@cucumber/cucumber";
import { beforeStep, binding } from "cucumber-tsflow";
import IndianReportClass from "../class/report.class";

@binding()
export class BeforeHook {
    @beforeStep()
    public beforeStepHook(testStepHook:ITestStepHookParameter): void {
       IndianReportClass.testStepHook = testStepHook
    }
}