import { BasePageVo } from '/@/api/model/baseModel';

export interface AuthDataPageVo extends BasePageVo {
  logCode?: string;
  requestIp?: string;
  authType?: string;
  authUserName?: string;
  authClientName?: string;
  authStatus?: number;
}

export interface AuthDataPageDto {
  authLogId: string;
  logCode: string;
  requestIp: string;
  authType: string;
  authUserId: string;
  authUserName: string;
  authClientCode: string;
  authClientName: string;
  authStatus: number;
  costTime: number;
  requestStartTime: string;
  requestEndTime: string;
  createUserName: string;
  createTime: string;
}

export interface AuthDataDto {
  authLogId: string;
  logCode: string;
  requestIp: string;
  authType: string;
  authUserId: string;
  authUserName: string;
  authClientCode: string;
  authClientName: string;
  authStatus: number;
  logData: string;
  logOtherData: string;
  exceptionMessage: string;
  costTime: number;
  requestStartTime: string;
  requestEndTime: string;
  createUserName: string;
  createTime: string;
}
