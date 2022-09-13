import { BasePageVo } from '/@/api/model/baseModel';

export interface RbacResourcePageVo extends BasePageVo {
  resourceCode: string;
  resourceName: string;
  resourceStatus: number;
  resourceType: number;
}

export interface RbacResourcePageDto {
  resourceId: string;
  resourceCode: string;
  resourceName: string;
  resourceIcon: string;
  resourceStatus: number;
  remark: number;
  createUserName: string;
  createTime: string;
  requestPrefix: string;
  resourceType: number;
  resourceDocUrl: string;
  docType: number;
  syncTime: string;
}

export interface RbacResourceVo {
  resourceId: string;
  resourceCode: string;
  resourceName: string;
  resourceIcon: string;
  resourceStatus: number;
  remark: number;
  createUserName: string;
  createTime: string;
  requestPrefix: string;
  resourceType: number;
  resourceDocUrl: string;
  docType: number;
  syncTime: string;
}

export interface RbacResourceDto {
  slots?: any;
  resourceId: string;
  apiTagName: string;
  resourceIdAndTag: string;
  resourceCode: string;
  resourceName: string;
  resourceIcon: string;
  resourceStatus: number;
  remark: number;
  createUserId: string;
  createUserName: string;
  createTime: string;
  requestPrefix: string;
  resourceType: number;
  resourceDocUrl: string;
  docType: number;
  syncTime: string;
}
