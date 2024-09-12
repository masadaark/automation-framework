export interface FeatureReportModel {
  id: number;
  uri: string;
  name: string;
  scenarios: ScenarioReportModel[];
  overview?: ReportOverview
  testStepOverview?: ReportOverview
}

export interface ScenarioReportModel {
  id: number;
  name: string;
  testSteps: TestStepReportModel[];
  overview?: ReportOverview
}

export interface TestStepReportModel {
  id: number;
  name: string;
  contents: any[];
  duration?: number;
  testStatus?: string;
}


export interface ReportOverview {
  duration?: number;
  testStatus?: string;
  failed: number;
  passed: number;
  ran: number;
}