export interface FeatureReportModel {
  id: number;
  uri: string;
  name: string;
  scenarios: ScenarioReportModel[];
}

export interface ScenarioReportModel {
  id: number;
  name: string;
  testSteps: TestStepReportModel[];
  duration?: number;
  testStatus?: string;
}

export interface TestStepReportModel {
  id: number;
  name: string;
  content: any[];
  duration?: number;
  testStatus?: string;
}
