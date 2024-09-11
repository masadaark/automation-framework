import IndianReportClass from "../class/report.class"
import { TestStepReportModel } from '../interface/report.model';
import { FeatureMapModel, ScenarioMapModel } from "../interface/report_map.model";

class IndianReportLogic {
    public static AddTestStep(content: any) {
        const scenarioId = IndianReportClass.testStepHook.pickle.id
        const stepId = IndianReportClass.testStepHook.pickleStep.id
        const uri = IndianReportClass.testStepHook.pickle.uri
        const feature = this.featureContent(uri)
        const scenario = this.scenarioContent(feature, scenarioId)
        const testStep = this.testStepContent(scenario, stepId)
        testStep.content.push(content)
        scenario.testStepMap[stepId] = testStep
        feature.scenarioMap[scenarioId] = scenario
        IndianReportClass.addFeature(uri, feature)
    }

    public static AddTestStepResult(duration: number, status: string) {
        const scenarioId = IndianReportClass.testStepHook.pickle.id
        const stepId = IndianReportClass.testStepHook.pickleStep.id
        const uri = IndianReportClass.testStepHook.pickle.uri
        const feature = this.featureContent(uri)
        const scenario = this.scenarioContent(feature, scenarioId)
        const testStep = this.testStepContent(scenario, stepId)
        testStep.duration = duration
        testStep.testStatus = status
        scenario.testStepMap[stepId] = testStep
        feature.scenarioMap[scenarioId] = scenario
        IndianReportClass.addFeature(uri, feature)
    }

    private static featureContent(uri: string): FeatureMapModel {
        let feature = IndianReportClass.getfeatureMap(uri)
        if (feature) return feature
        return {
            id: IndianReportClass.featureCount() + 1,
            uri,
            name: IndianReportClass.testStepHook.gherkinDocument.feature?.name ?? "",
            scenarioMap: {}
        }
    }
    private static scenarioContent(feature: FeatureMapModel, scenarioId: string): ScenarioMapModel {
        let scenario = feature.scenarioMap[scenarioId]
        if (scenario) return scenario
        return {
            id: Object.keys(feature.scenarioMap).length + 1,
            name: IndianReportClass.testStepHook.pickle.name,
            testStepMap: {},
        }
    }
    private static testStepContent(scenario: ScenarioMapModel, stepId: string): TestStepReportModel {
        let testStep = scenario.testStepMap[stepId]
        if (testStep) return testStep
        return {
            id: Object.keys(scenario.testStepMap).length + 1,
            name: IndianReportClass.testStepHook.pickleStep.text,
            content: []
        }
    }
}

export default IndianReportLogic