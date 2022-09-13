import { BasePageVo } from '/@/api/model/baseModel';

export interface OperatePageVo extends BasePageVo {
  operateType?: string;
  logType?: string;
  dataSources?: string;
  userName?: string;
  logCode?: string;
  requestIp?: string;
  requestUrl?: string;
  operateStatus?: number;
}

export interface OperatePageDto {
  operateId: string;
  operateType: number;
  logType: string;
  logTypeDescribe: string;
  userId: string;
  userName: string;
  logCode: string;
  requestIp: string;
  requestUrl: string;
  requestMethod: string;
  operateStatus: number;
  dataSources: string;
  dataSourcesDescribe: string;
  costTime: number;
  requestStartTime: string;
  requestEndTime: string;
  createUserName: string;
  createTime: string;
  requestClientCode: string;
  requestClientName: string;
}

export interface OperateDto {
  operateId: string;
  operateType: number;
  logType: string;
  logTypeDescribe: string;
  userId: string;
  userName: string;
  logCode: string;
  requestIp: string;
  requestUrl: string;
  requestMethod: string;
  requestParam: string;
  requestResult: string;
  logOtherData: string;
  operateStatus: number;
  dataSources: string;
  dataSourcesDescribe: string;
  costTime: number;
  requestStartTime: string;
  requestEndTime: string;
  exceptionMessage: string;
  createUserName: string;
  createTime: string;
  requestClientCode: string;
  requestClientName: string;
}
