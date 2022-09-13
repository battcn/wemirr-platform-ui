import { BasePageVo } from '/@/api/model/baseModel';

export interface DesignModelHistoryPageVo extends BasePageVo {
  keyword: string;
  modelId: string;
}

export interface DesignModelHistoryPageDto {
  historyModelId: string;
  modelId: string;
  diagramNames: string;
  deploymentName: string;
  deploymentId: string;
  deploymentTime: string;
  category: string;
  categoryName: string;
  version: string;
  processDefinitionKeys: string;
  processDefinitionIds: string;
  havePool: string;
  active: number;
  suspended: number;
  completed: number;
  externallyTerminated: number;
  internallyTerminated: number;
  createUserName: string;
  createTime: string;
}

export interface DesignModelHistoryDto {
  historyModelId: string;
  modelId: string;
  diagramNames: string;
  deploymentName: string;
  deploymentId: string;
  deploymentTime: string;
  category: string;
  categoryName: string;
  version: string;
  processDefinitionKeys: string;
  processDefinitionIds: string;
  havePool: string;
  active: number;
  suspended: number;
  completed: number;
  externallyTerminated: number;
  internallyTerminated: number;
  diagramData: string;
  remark: string;
  createUserName: string;
  createTime: string;
}

export interface DeleteHistoryDesignModelVo {
  historyModelId: string;
  cascade: boolean;
  skipCustomListeners: boolean;
  skipIoMappings: boolean;
}
