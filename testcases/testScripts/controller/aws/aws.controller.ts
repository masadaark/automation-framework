import { binding, given, when } from 'cucumber-tsflow';
import Cfg from '../../class/config.class';
import AwsLogic from '../../logic/aws/aws_s3.logic';
import ResClass from '../../class/response.class';
import FileReaderLogic from '../../logic/file_reader.logic';
import ScenarioClass from '../../class/scenario.class';
import VFormatter from '../../class/formatter.class';

@binding()
export class AwsS3Controller {
  @given('Mock AwsS3 Bucket:{string} Key:{string} File:{string}', { timeout: Cfg.stepTimeOut })
  public async UploadFileToS3(bucketName: string, s3Key: string, file: string): Promise<void> {
    await AwsLogic.UpLoadFileToS3(bucketName, s3Key, file);
  }
  @when('Get AwsS3 Bucket:{string} Key:{string} === File:{string}', { timeout: Cfg.stepTimeOut })
  public async GetObjectFormS3(bucketName: string, s3Key: string, file: string): Promise<void> {
    const response = await AwsLogic.GetObjectFromS3(bucketName, s3Key);
    const fileType = file.split('.')[file.split('.').length - 1];
    ResClass.Http = { body: response ? AwsLogic.ConvFileType(response, fileType) : undefined };
    const expContent = await FileReaderLogic.ReadText(file);
    ScenarioClass.Http = {
      tcNo: [],
      request: {},
      response: {
        body: VFormatter.Exec(AwsLogic.ConvFileType(expContent, fileType)),
      },
    };
  }
}
