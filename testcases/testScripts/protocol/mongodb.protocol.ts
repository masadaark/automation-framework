import { MongoClient } from 'mongodb';
import { MongoDBConfig } from '../interface/app_setting.model';

export class ProtocolMongoDB {
  private static _client: MongoClient | undefined;

  private static _url: string;

  private static _dbName: string;

  private static _errorPrefix = 'MongoDB Err : ';

  private static async Connect() {
    try {
      if (!this._client) this._client = await MongoClient.connect(this._url);
    } catch (err) {
      throw new Error(`${this._errorPrefix}เชื่อมต่อไม่สำเร็จ ตรวจสอบ url (${err})`);
    }
  }

  private static async Close() {
    if (this._client) {
      await this._client.close();
      this._client = undefined;
    }
  }

  static async InsertCollection(dbName: string, collectionName: string, data: Record<string, any>[]) {
    await this.Connect();
    try {
      const dbo = this._client?.db(dbName ?? this._dbName);
      const collection = dbo?.collection(collectionName);
      await collection?.insertMany(data);
    } catch (err) {
      throw new Error(`${this._errorPrefix}สร้างข้อมูลไม่สำเร็จ (${err})`);
    } finally {
      await this.Close();
    }
  }

  public static Init(cfg: MongoDBConfig) {
    this._url = cfg?.url;
    this._dbName = cfg?.dbName;
  }
}
