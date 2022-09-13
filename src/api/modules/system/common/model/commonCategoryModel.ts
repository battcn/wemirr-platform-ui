import { BasePageVo } from '/@/api/model/baseModel';

export interface CommonCategoryVo {
  orgId: string;
  parentId: string;
  orgName: string;
  orgNameEn: string;
  orgNameAbbr: string;
  orgOrder: number;
  orgType: number;
  orgCode: string;
  orgSysCode: string;
  orgStatus: string;
  autoBind: string;
  phone: string;
  fax: string;
  address: string;
  remark: string;
}

export interface CommonCategoryPageDto {
  orgId: string;
  parentId: string;
  orgName: string;
  orgNameEn: string;
  orgNameAbbr: string;
  orgOrder: number;
  orgType: number;
  orgCode: string;
  orgSysCode: string;
  orgStatus: string;
  autoBind: string;
  phone: string;
  fax: string;
  address: string;
  remark: string;
}

export interface CommonCategoryPageVo extends BasePageVo {
  orgId: string;
  parentId: string;
  orgName: string;
  orgNameEn: string;
  orgNameAbbr: string;
  orgOrder: number;
  orgType: number;
  orgCode: string;
  orgSysCode: string;
  orgStatus: string;
  autoBind: string;
  phone: string;
  fax: string;
  address: string;
  remark: string;
}
