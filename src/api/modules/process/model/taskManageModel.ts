import { BasePageVo } from '/@/api/model/baseModel';

export interface DesignModelPageVo extends BasePageVo {
  keyword: string;
  modelState: number;
}

export interface DesignModelPageDto {
  modelId: string;
  processId: string;
  diagramNames: string;
  modelState: string;
  version: string;
  remark: string;
  createUserName: number;
  createTime: string;
}

export interface DesignModelVo {
  diagramNames: string;
  processId: string;
  remark: string;
}

export interface DesignModelDto {
  modelId: string;
  processId: string;
  diagramData: string;
  diagramNames: string;
  modelState: string;
  remark: number;
  createUserId: number;
  createUserName: string;
  createTime: string;
}

export interface DesignModelBpmnDataVo {
  modelId: string;
  diagramData: string;
}

export interface DesignModelDeploymentStatiDto {
  noDeployment: number;
  deployment: number;
  newVersion: number;
}
