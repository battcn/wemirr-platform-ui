import { BasePageVo } from '/@/api/model/baseModel';

export interface CommonAreaPageVo extends BasePageVo {
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

export interface CommonAreaPageDto {
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

export interface CommonAreaVo {
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

export interface CommonAreaDto {
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

export interface CommonAreaTreeDto extends CommonAreaDto {
  children: CommonAreaTreeDto[];
  isLeaf: boolean;
  hasChildren: boolean;
}
