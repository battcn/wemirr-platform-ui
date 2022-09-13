import { BasePageVo } from '/@/api/model/baseModel';

export interface RbacUserPageDto {
  userId: string;
  orgId: string;
  userName: string;
  nickName: string;
  realName: string;
  avatar: string;
  sex: number;
  email: string;
  phone: string;
  userStatus: number;
  workNo: string;
  currentLoginTime: string;
  remark: string;
  createTime: string;
}

export interface RbacUserPageVo extends BasePageVo {
  orgId: string;
  keyword: string;
  userStatus: number;
}
export interface RbacEnalbeUserPageVo extends BasePageVo {
  orgId: string;
  keyword: string;
}

export interface RbacUserVo {
  userName: string;
  nickName: string;
  realName: string;
  avatar: string;
  birthday: string;
  sex: number;
  email: string;
  phone: string;
  userStatus: number;
  workNo: string;
  telephone: string;
  remark: string;
  orgId: string;
  positionIds: string[];
}

export interface RbacUserDto {
  userId: string;
  userName: string;
  nickName: string;
  realName: string;
  avatar: string;
  sex: number;
  email: string;
  phone: string;
  userStatus: number;
  workNo: string;
  currentLoginTime: string;
  remark: string;
  createTime: string;
  orgInfo: OrgInfoDto;
  orgId: string;
  positionInfos: PositionInfoDto;
  positionIds: string[];
  orgRoleIds: string[];
  orgRoleInfos: any[];
  roleIds: string[];
  roleInfos: any[];
}

export interface OrgInfoDto {
  orgId: string;
  orgCode: string;
  orgSysCode: string;
  orgName: string;
  autoBind: number;
  orgType: number;
}

export interface PositionInfoDto {
  positionId: string;
  positionCode: string;
  positionName: string;
  positionRank: number;
  autoBind: number;
}

export interface RbacCorrelateRoleVo {
  correlateId: string;
  correlateType: number;
  roleIds: string[];
}

export interface RbacJoinOrgVo {
  orgId: string;
  userIds: string[];
}
