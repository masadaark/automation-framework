import { ITestStepHookParameter } from '@cucumber/cucumber';
import { FeatureReportModel, ReportOverview } from '../interface/report.model';
import { FeatureMapModel } from '../interface/report_map.model';
import * as _ from 'lodash';
import Big from 'big.js';
class IndianReportClass {
  private static _testStepHook: ITestStepHookParameter;

  private static _reportContentMap: Record<string, FeatureMapModel> = {};

  static get testStepHook(): ITestStepHookParameter {
    return this._testStepHook;
  }

  static set testStepHook(val: ITestStepHookParameter) {
    this._testStepHook = val;
  }

  static getfeatureMap(uri: string): FeatureMapModel | undefined {
    return this._reportContentMap[uri];
  }

  static featureCount(): number {
    return Object.keys(this._reportContentMap).length;
  }

  static addFeature(uri: string, feature: FeatureMapModel): void {
    this._reportContentMap[uri] = feature;
  }

  static toReport() {
    const features = _.sortBy(Object.values(this._reportContentMap), 'id').map(this.featureMaptoFeatureReport);
    const overview = IndianReportClass.reportOverview(features);
    return {
      features,
      overview,
      scnarioOverview: IndianReportClass.sumOverview(features.map((o) => o.overview as ReportOverview)),
      testStepOverview: IndianReportClass.sumOverview(features.map((o) => o.testStepOverview as ReportOverview)),
    };
  }

  private static featureMaptoFeatureReport(featureMap: FeatureMapModel): FeatureReportModel {
    const scenarios = _.sortBy(Object.values(featureMap.scenarioMap), 'id').map((scenario) => {
      const testSteps = _.sortBy(Object.values(scenario.testStepMap), 'id');
      const overview = IndianReportClass.reportOverview(testSteps);
      return {
        id: scenario.id,
        name: scenario.name,
        testSteps,
        overview,
      };
    });
    const overview = IndianReportClass.reportOverview(scenarios);
    const testStepOverview = IndianReportClass.sumOverview(scenarios.map((o) => o.overview));
    return {
      id: featureMap.id,
      uri: featureMap.uri,
      name: featureMap.name,
      scenarios,
      overview,
      testStepOverview,
    };
  }

  private static reportOverview(reports: any[]): ReportOverview {
    let duration = Big(0);
    let failed: Big | number = Big(0);
    for (const step of reports) {
      const overview = step.overview ?? step;
      if (overview.testStatus === 'FAILED') failed = failed.add(1);
      duration = duration.add(overview.duration ?? 0);
    }
    failed = failed.toNumber();
    return {
      duration: duration.toNumber(),
      testStatus: failed === 0 ? 'PASSED' : 'FAILED',
      failed,
      passed: Big(reports.length).minus(failed).toNumber(),
      ran: reports.length,
    };
  }

  private static sumOverview(overviews: ReportOverview[]): ReportOverview {
    return overviews.reduce(
      (acc, cur) => {
        const { failed, passed, ran } = cur;
        acc.failed += failed;
        acc.passed = Big(acc.passed).add(passed).toNumber();
        acc.ran = Big(acc.ran).add(ran).toNumber();

        return acc;
      },
      {
        failed: 0,
        passed: 0,
        ran: 0,
      } as ReportOverview
    );
  }
}

export default IndianReportClass;
