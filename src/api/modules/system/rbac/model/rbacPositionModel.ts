import { BasePageVo } from '/@/api/model/baseModel';

export interface RbacPositionDto {
  positionId: string;
  positionCode: string;
  positionName: string;
  positionRank: number;
  remark: number;
}

export interface RbacPositionPageVo extends BasePageVo {
  keyword: string;
  positionStatus: number;
}

export interface RbacPositionPageDto {
  positionId: string;
  positionCode: string;
  positionName: string;
  autoBind: number;
  positionRank: number;
  positionStatus: number;
  createUserName: string;
  createTime: string;
  remark: string;
}

export interface RbacPositionVo {
  positionName: string;
  positionCode: string;
  positionRank: number;
  positionStatus: number;
  remark: number;
}
