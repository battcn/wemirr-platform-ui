import { BasePageVo } from '/@/api/model/baseModel';

export interface RbacResourceApiPageVo extends BasePageVo {
  resourceId: string;
  apiUriAll: string;
  apiName: string;
  apiTagName: string;
  apiVersions: string;
  requireAuth: number;
}

export interface RbacResourceApiPageDto {
  apiId: string;
  resourceId: string;
  resourceCode: string;
  apiUri: string;
  apiUriAll: string;
  requestPrefix: string;
  apiName: string;
  apiNotes: string;
  requestMethod: string;
  apiTag: string;
  apiTagName: string;
  apiVersions: string;
  requireAuth: number;
  authType: number;
  permissionExpress: string;
  haveNoRoleAction: number;
  permissionActions: string;
  remark: string;
  createUserName: string;
  createTime: string;
}

export interface RbacResourceApiVo {
  apiId: string;
  resourceId: string;
  resourceCode: string;
  apiUri: string;
  apiUriAll: string;
  requestPrefix: string;
  apiName: string;
  apiNotes: string;
  requestMethod: string;
  requestParams: Object;
  responseData: Object;
  apiTag: string;
  apiTagName: string;
  apiVersions: string;
  requireAuth: number;
  authType: number;
  permissionExpress: string;
  haveNoRoleAction: number;
  permissionActions: string;
  remark: string;
}

export interface RbacResourceApiDto {
  apiId: string;
  resourceId: string;
  resourceCode: string;
  apiUri: string;
  apiUriAll: string;
  requestPrefix: string;
  apiName: string;
  apiNotes: string;
  requestMethod: string | string[];
  requestParams: Object;
  responseData: Object;
  apiTag: string;
  apiTagName: string;
  apiVersions: string;
  requireAuth: number;
  authType: number;
  permissionExpress: string;
  haveNoRoleAction: number;
  permissionActions: string;
  remark: string;
  createUserName: string;
  createTime: string;
}

export interface RbacResourceApiExportVo {
  resourceId: string;
  apiDocJsonUrl: string;
  apiDocJsonData: string;
  docType: number;
}

export interface RbacResourceApiVersionDto {
  apiVersions: string;
  apiVersionsName: string;
}
