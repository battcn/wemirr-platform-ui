import { BasePageVo } from '/@/api/model/baseModel';

export interface RbacOrgTreeDto {
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

export interface RbacRolePermissionInfoDto {
  roleCode: string;
  roleSysCode: string;
  roleId: string;
  permissionId: string;
  title: string;
  actions: Action[];
}

export interface Action {
  permissionId: string;
  actions: string;
  title: string;
  actionType: number;
  parentId: string;
}
export interface RbacRolePageDto {
  roleId: string;
  roleName: string;
  roleCode: string;
  autoBind: string;
  enableDelete: string;
  remark: string;
  createUserName: string;
  roleStatus: string;
  createTime: string;
}

export interface RbacRolePageVo extends BasePageVo {
  keyword: string;
  roleStatus: number;
}

export interface RbacRoleEffectiveDto {
  roleId: string;
  roleName: string;
  roleCode: string;
  roleSysCode: string;
  remark: string;
  createUserName: string;
}

export interface RbacRoleDto {
  roleId: string;
  roleName: string;
  roleCode: string;
  roleStatus: number;
  enableDelete: number;
  autoBind: number;
  roleSysCode: string;
  remark: string;
  createUserName: string;
  parentRoleId: string;
  createTime: string;
  permissionInfos: RbacRolePermissionInfoDto[];
  menuIds: string[];
  apiIds: string[];
  selectApiInfos: any[];
  dataAuthType: number;
  customDataAuthData: string[];
}

export interface RbacRoleVo {
  roleName: string;
  roleCode: string;
  roleStatus: number;
  autoBind: number;
  remark: string;
}

export interface RbacRoleAuthVo {
  menuIds: string[];
  apiIds: string[];
  dataAuthType: number;
  customDataAuthData: string[];
}
