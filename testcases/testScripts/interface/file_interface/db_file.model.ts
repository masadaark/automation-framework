export interface DBFile {
    sql: string;
    scenarios: ScenarioDB[];
}

export interface ScenarioDB {
    paramReplace?: Record<string, string | number>
    tcNo: number[];
    expect?: Record<string, any>[];
}
