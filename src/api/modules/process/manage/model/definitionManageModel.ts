import { BasePageVo } from '/@/api/model/baseModel';

export interface DeploymentVo {
  deploymentName: string;
  modelId: string;
  activateProcessDate: string;
}

export interface DeploymentHistoryVo {
  deploymentName: string;
  historyModelId: string;
  activateProcessDate?: string;
  deploymentId: string;
}

export interface ProcessDefinitionPageVo extends BasePageVo {
  processId: string;
  resourceName: string;
}

export interface ProcessDefinitionPageDto {
  processId: string;
  version: string;
  deploymentId: string;
  resourceName: string;
  hasStartFormKey: boolean;
  processDefinitionId: string;
  isStartableInTasklist: boolean;
  deploymentTime: string;
  deploymentName: string;
  suspensionState: string;
  instanceNum: number;
  instanceCompleteNum: number;
}

export interface FormData {
  formKey: string;
  formFields: any[];
}

export interface DeploymentDetailDto {
  deploymentId: string;
  modelId: string;
  diagramNames: string;
  processId: string;
  processDefinitionId: string;
  suspensionState: number;
  deploymentName: string;
  isNew: boolean;
  version: number;
  versionTag: string;
  resourceName: string;
  diagramData: string;
  tenantId: string;
  previousProcessDefinitionId: string;
  hasStartFormKey: boolean;
  haveInitiator: boolean;
  initiatorValue: string;
  startFormData: string;
  diagramResourceName: string;
  category: string;
  revision: number;
}

export interface UpdateProcessDefinitionStateVo {
  processDefinitionId: string;
  processInstances: boolean;
  state: boolean;
}

export interface ProcessInfoVo {
  processDefinitionId?: string;
  processDefinitionKey?: string;
}

export interface ProcessTaskInfoDto {
  taskDefinitionKey: string;
  name: string;
  description: string;
  assignee: string;
  propertyModel: Object;
  formModel: Object;
  formKey: string;
  formRef: string;
  dueDateStr: string;
  dueFormatDate: string;
  followUpDateStr: string;
  followUpFormatDate: string;
  priority: number;
  multiInstance: boolean;
  sequential: boolean;
}

export interface ProcessInfoDto {
  processDefinitionKey: string;
  versionTag: string;
  version: number;
  category: string;
  categoryName: string;
  deploymentId: string;
  resourceNames: string;
  diagramData: string;
  name: string;
  hasStartFormKey: Boolean;
  processDefinitionId: string;
  isStartableInTasklist: boolean;
  deploymentTime: string;
  deploymentName: string;
  userTasks: ProcessTaskInfoDto[];
}
