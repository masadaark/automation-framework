import { MongoClient } from 'mongodb';
import { MongoDBConfig } from '../interface/app_setting.model';

export class ProtocolMongoDB {
  private static _client: any;

  private static _url: string;

  private static _dbName: string;

  private static async Connect() {
    try {
      if (!this._client) this._client = await MongoClient.connect(this._url);
    } catch (err) {
      throw new Error('เชื่อมต่อ MongoDB ไม่สำเร็จตรวจสอบ url :' + err);
    }
  }

  private static async Close() {
    if (this._client) {
      await this._client.close();
      this._client = undefined;
    }
  }

  public static Init(cfg: MongoDBConfig) {
    this._url = cfg?.url;
    this._dbName = cfg?.dbName;
  }
}
