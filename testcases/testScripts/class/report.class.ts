import { ITestStepHookParameter } from "@cucumber/cucumber";
import { FeatureReportModel } from '../interface/report.model';
import { FeatureMapModel } from "../interface/report_map.model";
import * as _ from 'lodash';
class IndianReportClass {

    private static _testStepHook: ITestStepHookParameter

    private static _reportContentMap: Record<string, FeatureMapModel> = {}

    static get testStepHook(): ITestStepHookParameter {
        return this._testStepHook;
    }

    static set testStepHook(val: ITestStepHookParameter) {
        this._testStepHook = val
    }

    static getfeatureMap(uri: string): FeatureMapModel | undefined {
        return this._reportContentMap[uri];
    }

    static featureCount(): number {
        return Object.keys(this._reportContentMap).length
    }

    static addFeature(uri: string, feature: FeatureMapModel): void {
        this._reportContentMap[uri] = feature
    }

    static toReport() {
        return _.sortBy(
            Object.values(this._reportContentMap),
            'id'
        ).map(this.featureMaptoFeatureReport)
    }

    private static featureMaptoFeatureReport(featureMap: FeatureMapModel): FeatureReportModel {
        return {
            id: featureMap.id,
            uri: featureMap.uri,
            name: featureMap.name,
            scenarios: _.sortBy(
                Object.values(featureMap.scenarioMap),
                'id'
            ).map(scenario => ({
                id: scenario.id,
                name: scenario.name,
                testSteps: _.sortBy(
                    Object.values(scenario.testStepMap),
                    'id'
                ),
                duration: scenario.duration,
                testStatus: scenario.testStatus
            }))
        };
    }
}

export default IndianReportClass