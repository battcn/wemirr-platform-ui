import { BasePageVo } from '/@/api/model/baseModel';
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';
export interface RbacOrgTreeDto extends TreeDataItem {
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

export interface RbacOrgPageVo extends BasePageVo {
  orgName: string;
  orgCode: string;
  orgStatus: string;
}

export interface RbacOrgTreePageDto {
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
  createUserId: string;
  createUserName: string;
  createTime: string;
  children?: RbacOrgTreePageDto[];
  isLeaf: boolean;
  hasChildren: boolean;
}

export interface RbacOrgVo {
  orgId: string;
  parentId: string;
  orgName: string;
  orgSimpleName: string;
  orgNameEn: string;
  orgNameAbbr: string;
  orgOrder: number;
  orgType: number;
  orgCode: string;
  orgSysCode: string;
  orgStatus: string;
  email: string;
  phone: string;
  fax: string;
  address: string;
  socialCode: string;
  areaCode: string;
  areaCodeName: string;
  detailAddress: string;
  scopeBusiness: string;
  legalPerson: string;
  accountsName: string;
  accountsBank: string;
  backCard: string;
  businessLicensePicture: string;
  sealPicture: string;
  remark: string;
  orgMenuIds: string[];
  orgResourceIds: string[];
}

export interface RbacOrgDto {
  orgId: string;
  parentId: string;
  orgName: string;
  orgSimpleName: string;
  orgNameEn: string;
  orgNameAbbr: string;
  orgOrder: number;
  orgType: number;
  orgCode: string;
  orgSysCode: string;
  orgStatus: string;
  email: string;
  phone: string;
  fax: string;
  address: string;
  socialCode: string;
  areaCode: string;
  areaCodeName: string;
  detailAddress: string;
  scopeBusiness: string;
  legalPerson: string;
  accountsName: string;
  accountsBank: string;
  backCard: string;
  businessLicensePicture: string;
  sealPicture: string;
  remark: string;
  orgMenuIds: string[];
  orgResourceIds: string[];
  orgResourceInfos: any[];
}
