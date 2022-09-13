import { BasePageVo } from '/@/api/model/baseModel';
export const InstanceState = {
  1: '活动',
  2: '挂起',
  3: '完成',
  4: '外部终止',
  5: '内部终止',
};
export interface ProcessInstanceHistoryPageVo extends BasePageVo {
  processDefinitionId: string;
  state: number;
  finished: boolean;
  realName: string;
  processDefinitionName: string;
}
export interface RbacUserDto {
  userId: string;
  userName: string;
  nickName: string;
  realName: string;
  avatar: string;
  birthday: string;
  sex: number;
  email: string;
  phone: string;
  orgIds: string;
  userStatus: number;
  workNo: string;
  telephone: string;
  currentLoginTime: string;
  remark: string;
  createTime: string;
}
export interface InstanceHistoryPageDto {
  deleteReason: string;
  instanceState: number;
  version: number;
  startUserInfo: RbacUserDto;
  processInstanceId: string;
  processDefinitionId: number;
  businessKey: number;
  startActivityId: string;
  endActivityId: string;
  currentTaskId: string;
  currentTaskName: string;
  currentAssigneeUserId: string;
  currentAssigneeName: string;
  currentOwnerUserId: number;
  currentOwnerUserName: number;
  processDefinitionName: string;
  instanceStartTime: string;
  instanceRemovalTime: string;
  isFinish: boolean;
  durationInMillis: number;
  durationInMillisFormat: string;
  instanceEndTime: string;
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
}
export interface TasksHistoryDetailDto {
  activityId: string;
  activityName: number;
  activityType: number;
  approvalOpinions: RbacUserDto;
  activityInstanceId: string;
  activityInstanceState: number;
  taskId: string;
  taskStartTime: string;
  taskEndTime: string;
  durationInMillis: number;
  durationInMillisFormat: string;
  durationStr: string;
  userInfos: RbacUserDto[];
  groupInfos: RbacRoleDto[];
  taskAssigneeInfo: RbacUserDto;
  sequenceCounter: number;
  taskRemovalTime: string;
}

export interface HistoricVariableDto {
  variableState: number;
  createTime: string;
  removalTime: string;
  name: string;
  value: string;
  id: string;
}
export interface InstanceDetailDto {
  versionTag: string;
  processInstanceId: string;
  diagramData: string;
  isFinish: Boolean;
  instanceState: number;
  deploymentName: string;
  processDefinitionId: string;
  businessKey: string;
  startUserInfo: RbacUserDto;
  deleteReason: string;
  startActivityId: string;
  endActivityId: string;
  durationInMillis: number;
  durationInMillisFormat: string;
  durationStr: string;
  instanceStartTime: string;
  instanceRemovalTime: string;
  instanceEndTime: string;
  instanceStatus: boolean;
  historyTaskInfos: TasksHistoryDetailDto[];
  historyTaskCommentInfos: TasksHistoryDetailDto[];
  historyVariableInfos: HistoricVariableDto[];
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

export interface InstanceStatiDto {
  total: number;
  finish: number;
  unFinish: number;
}
