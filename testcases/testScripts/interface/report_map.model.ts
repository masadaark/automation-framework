import { TestStepReportModel } from "./report.model"

export interface FeatureMapModel {
    id: number
    uri: string
    name: string
    scenarioMap: Record<string, ScenarioMapModel>
}

export interface ScenarioMapModel {
    id: number
    name: string
    testStepMap: Record<string, TestStepReportModel>
    duration?: number
    testStatus?: string
}