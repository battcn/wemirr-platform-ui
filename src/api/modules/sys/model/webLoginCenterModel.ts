export interface LoginRouteTreeModel {
  email: string;
  name: string;
  introduction: string;
  phone: string;
  address: string;
}

export interface ChangePasswordVo {
  email: string;
  name: string;
  introduction: string;
  phone: string;
  address: string;
}

export interface ChangeUserInfoVo {
  email: string;
  name: string;
  introduction: string;
  phone: string;
  address: string;
}

export interface FindPasswordVo {
  email: string;
  name: string;
  introduction: string;
  phone: string;
  address: string;
}

export interface CheckOldUserPhoneVo {
  email: string;
  name: string;
  introduction: string;
  phone: string;
  address: string;
}

export interface ChangeUserPhoneVo {
  email: string;
  name: string;
  introduction: string;
  phone: string;
  address: string;
}

export interface BindUserPhoneVo {
  email: string;
  name: string;
  introduction: string;
  phone: string;
  address: string;
}

export interface UserOrgTreeInfo {
  orgId: string;
  parentId: string;
  orgName: string;
  orgSimpleName: string;
  orgNameEn: string;
  orgNameAbbr: string;
  orgOrder: string;
  orgType: number;
  orgCode: string;
  orgSysCode: string;
  orgStatus: number;
  email: string;
  phone: string;
  fax: string;
  address: string;
  socialCode: string;
  areaCode: string;
  areaCodeName: string;
}
