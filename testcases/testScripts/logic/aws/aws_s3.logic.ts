import { expect } from 'chai';
import { AppSettingModel } from '../../interface/app_setting.model';
import { EnumFilePath } from '../../enum/file_path.enum';
import IndianReportLogic from '../report.logic';
import FileU from '../../util/file.util';
import axios from 'axios'
import fs from 'fs';
class AwsLogic {
  private static s3EndPoint: string;

  static Init(cfg: AppSettingModel) {
    this.s3EndPoint = cfg?.aws?.s3 ?? '';
  }

  static async UpLoadFileToS3(bucketName: string, s3Key: string, file: string) {
    if (!this.s3EndPoint) throw Error('ไม่พบ s3 enpoint app-setting.json{aws.s3:??}');
    s3Key = encodeURIComponent(s3Key)
    const filPath = `${EnumFilePath.PAYLOAD_FOLDER}/aws/s3/${file}`;
    const fileContent = await FileU.readText(filPath)
    IndianReportLogic.AddTestStep(fileContent)
    let resp: any
    try {
      resp = await axios.put(`${this.s3EndPoint}/${bucketName}/${s3Key}?x-id=PutObject`, fileContent, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } catch (err) {
      console.log(err)
    }
    expect(resp.status, `s3_key:${s3Key} put status`).eq(200)
  }

  static async GetObjectFromS3(bucketName: string, s3Key: string) {
    const s3EndPoint = this.s3EndPoint.endsWith('/') ? this.s3EndPoint : `${this.s3EndPoint}/`;
    const url = new URL(`${s3EndPoint}${bucketName}/${s3Key}?x-id=GetObject`);

    try {
      IndianReportLogic.AddTestStep((await axios.get(String(url))).data);
    } catch (error) {
      console.error('HTTP request error:', error);
    }
  }
}

export default AwsLogic;
