import FileReaderLogic from './file_reader.logic';
import { Collector, CollectorFile } from '../interface/file_interface/collection.model';
import Obj from '../util/object.util';
import TcClass from '../class/test_cases.class';
import Validator from './validator.logic';
import { ContentTypeEnum } from '../enum/content.enum';
import ResClass from '../class/response.class';
import StorageClass from '../class/storage.class';
import StorageLogic from './storage.logic';

export default class CollectorLogic {
  static async JsonFile(file: string, type: number) {
    const collectorFile = (await FileReaderLogic.JsonPayload(file)) as CollectorFile[];
    const collectionsSce = Obj.New(Obj.FindInclude(collectorFile, 'tcNo', TcClass.tcNo));
    if (!Validator.Var(collectionsSce)) return;
    const collections: Collector[] = collectionsSce.collections;
    switch (type) {
      case ContentTypeEnum.postgresql:
        return collections.map((collection) => this.CollectionSwitch(ResClass.Query, collection));
      case ContentTypeEnum.http:
        return collections.map((collection) => this.CollectionSwitch(ResClass.Http.body, collection));
    }
  }
  private static CollectionSwitch(res: any, collect: Collector) {
    if (collect.responseKey) {
      this.CollectByKey(res, collect.responseKey, collect['varKey']);
    } else if (collect.responsePath) {
      this.CollectByPath(res, collect.responsePath, collect['varKey']);
    } else throw new Error('Invalid Collection Mode');
  }
  private static CollectByKey(input: any, resKey: string, varName: string): void {
    if (input !== null && typeof input === 'object') {
      if (Object.prototype.hasOwnProperty.call(input, resKey)) {
        StorageClass.add(varName, input[resKey]);
        return;
      }
      for (const key in input) {
        this.CollectByKey(input[key], resKey, varName);
      }
    }
  }
  public static CollectByPath(input: {}, path: string, varName: string) {
    StorageClass.add(varName, StorageLogic.ObjPathVal(input, path));
  }
}
