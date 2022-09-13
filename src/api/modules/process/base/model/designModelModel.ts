import { BasePageVo } from '/@/api/model/baseModel';

export interface DesignModelPageVo extends BasePageVo {
  category: string;
  diagramNames: string;
  modelState: number;
}

export interface DesignModelPageDto {
  modelId: string;
  diagramNames: string;
  modelState: number;
  processDefinitionKeys: string;
  version: string;
  createUserName: string;
  createTime: string;
  category: string;
  categoryName: string;
  havePool: string;
  deploymentName: string;
  deploymentId: string;
}

export interface DesignModelVo {
  diagramNames: string;
  havePool: number;
  diagramData: string;
  category: string;
}

export interface DesignModelDto {
  modelId: string;
  processDefinitionKeys: string;
  diagramData: string;
  diagramNames: string;
  modelState: number;
  remark: string;
  createUserId: string;
  createUserName: string;
  createTime: string;
  category: string;
  categoryName: string;
}

export interface DesignModelDeploymentStatiDto {
  noDeployment: number;
  deployment: number;
  newVersion: number;
}

export interface DeleteDesignModelVo {
  modelId: string;
  cascade: boolean;
  skipCustomListeners: boolean;
  skipIoMappings: boolean;
}
