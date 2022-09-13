import { BasePageVo } from '/@/api/model/baseModel';

export interface DesignExpressionPageVo extends BasePageVo {
  keyword: string;
  handleType: number;
  expressionType: number;
  expressionState: number;
}

export interface StorageInfoModel {
  fileId: string;
  fileOriginalName: string;
  fileType: string;
  fileDirPrefix: string;
  fileStorageType: number;
  contentType: string;
  fileSize: string;
  fileSizeDetail: number;
  fileMd5: string;
  fileRelativePath: string;
  endpoint: string;
  fileHost: string;
  remark: string;
  createUserName: string;
  createTime: string;
}
