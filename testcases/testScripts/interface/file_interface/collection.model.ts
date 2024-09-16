export interface Collector {
  responseKey?: string;
  responsePath?: string;
  varKey: string;
}

export interface CollectorFile {
  tcNo: number[];
  collections: Collector[];
}
