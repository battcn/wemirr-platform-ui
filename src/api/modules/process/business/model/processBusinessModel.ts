import { BasePageVo } from '/@/api/model/baseModel';

export interface ProcessQueryPageVo extends BasePageVo {
  finishState: number;
  processState: number;
  businessKey: string;
  title: string;
  category: string;
  processFormEquals: Object;
  processFormLike: Object;
  processFormTime: Object;
}

export interface FormSubmitProcessModel {
  businessKey?: string;
  processDefinitionId?: string;
  processDefinitionKey?: string;
  requireCallback: boolean;
  callbackType?: string;
  callbackInfo?: Object;
  processVariables?: Object;
  startFormData?: Object;
}

export interface ProcessCallbackResultModel {
  startFormFields: Object[];
  startFormKey: string;
  processInstanceId: string;
  processDefinitionId: string;
  businessKey: string;
  multiInstanceTask: boolean;
  executionId: string;
  taskInfoList: TaskInfo[];
}

export interface TaskInfo {
  taskFormFields: Object[];
  taskFormKey: string;
  taskId: string;
  executionId: string;
  owner: string;
  assignee: string;
  name: string;
  taskDefinitionKey: string;
}

export interface MsgSubmitProcessModel {
  businessKey: string;
  messageName: string;
  processVariables?: Object;
  startFormData?: Object;
}

export interface CancelProcessVo {
  businessKey: string;
  processInstanceId: string;
}

export interface ProcessPageDto {
  durationInMillis: number;
  durationInMillisFormat: string;
  processEndTime: string;
  processStartTime: string;
  startTitle: string;
  processName: string;
  processCategory: string;
  processCategoryName: string;
  businessKey: string;
  processInstanceId: string;
  tenantId: string;
  finishState: number;
  processState: number;
  startFormData: Object;
  applyUserInfo: Object;
  currentActivityName: string;
  currentActivityType: string;
  currentAssignee: string;
  currentTaskId: string;
  currentStartTime: string;
  currentEndTime: string;
  currentDurationInMillis: number;
  currentDurationInMillisFormat: string;
  currentId: string;
}

export interface ProcessInstanceDetailDto {
  durationInMillis: number;
  durationInMillisFormat: string;
  processEndTime: string;
  processStartTime: string;
  startTitle: string;
  processCategory: string;
  processCategoryName: string;
  businessKey: string;
  processInstanceId: string;
  tenantId: string;
  finishState: number;
  processState: number;
  startFormData: Object;
  applyUserInfo: Object;
  currentActivityName: string;
  currentActivityType: string;
  currentAssignee: string;
  currentTaskId: string;
  currentStartTime: string;
  currentEndTime: string;
  currentDurationInMillis: number;
  currentDurationInMillisFormat: string;
  currentId: string;
}
export interface ProcessHandleUserModel {
  userId: string;
  userName: string;
  nickName: string;
  realName: string;
  avatar: string;
  birthday: string;
  shortProfile: string;
  sex: number;
  email: string;
  phone: string;
  currentOrgId: string;
  currentOrgName: string;
  currentOrgCode: string;
  currentTenantId: string;
}
export interface ProcessUserModel {
  userId: string;
  userName: string;
  nickName: string;
  realName: string;
  avatar: string;
  birthday: string;
  shortProfile: string;
  sex: number;
  email: string;
  phone: string;
  orgIds: string;
  workNo: string;
  telephone: string;
}
export interface TaskOptionInfoModel {
  comment: string;
  submitTime: string;
}
export interface AttachmentInfoModel {
  fileOriginalName: string;
  fileName: string;
  fileType: string;
  contentType: string;
  fileSize: string;
  fileSizeDetail: string;
  fileMd5: string;
  fileDiskRelativePath: string;
}
export interface ApprovalInfoModel {
  approvalStatus: number;
  approvalOpinions: TaskOptionInfoModel[];
  attachmentInfos: AttachmentInfoModel[];
}
export interface ProcessRoleModel {
  roleId: string;
  roleName: string;
  roleCode: string;
  roleSysCode: string;
  remark: string;
  parentRoleId: string;
}
export interface Button {
  name: string;
  code: string;
}
export interface UserTaskPropertyModel {
  taskSort: number;
  skipUserTask?: boolean;
  automaticCompleteUserTask?: boolean;
  automaticApprovalOpinions?: string;
  candidateGroups: string;
  candidateGroupNames: string;
  candidateGroupsType: number;
  candidateUsers: string;
  candidateUserNames: string;
  candidateUsersType: number;
  assignee: string;
  assigneeName: string;
  assigneeType: number;
  dueDate: string;
  dueFormatDate: string;
  dueDateType: number;
  followUpDate: string;
  followUpFormatDate: string;
  followUpDateType: number;
  notificationType: number[];
  buttons: Button[];
}
export interface ActInstanceDetailDto {
  id: string;
  activityId: string;
  activityName: string;
  activityType: string;
  activityInstanceId: string;
  activityInstanceState: number;
  parentActivityInstanceId: string;
  taskId: string;
  taskAssignee: string;
  taskAssigneeInfo: ProcessHandleUserModel;
  candidateUsers: ProcessUserModel[];
  candidateGroups: ProcessRoleModel[];
  durationInMillis: number;
  durationInMillisFormat: string;
  startTime: string;
  endTime: string;
  dueDate: string;
  followUpDate: string;
  dueDateStr: string;
  dueFormatDate: string;
  followUpDateStr: string;
  followUpFormatDate: string;
  sequenceCounter: number;
  taskTitle: string;
  handleType: string;
  handleTypeDescribe: string;
  propertyModel: UserTaskPropertyModel;
  formModel: Object;
  approvalStatus: number;
  optionInfos: ApprovalInfoModel;
  owner: string;
  ownerUserInfo: ProcessHandleUserModel;
}

export interface ActMultiInstanceDto {
  id: string;
  activityId: string;
  activityName: string;
  activityType: string;
  activityInstanceId: string;
  activityInstanceState: number;
  parentActivityInstanceId: string;
  durationInMillis: number;
  durationInMillisFormat: string;
  nrOfInstances: number;
  nrOfCompletedInstances: number;
  nrOfActiveInstances: number;
  loopCounter: number;
  nrOfApprovalInstances: number;
  nrOfNotApprovalInstances: number;
  startTime: string;
  endTime: string;
  sequenceCounter: number;
  instanceDetailList: ActInstanceDetailDto[];
}

export interface ActInstanceDto {
  activityName: string;
  activityId: string;
  activityType: string;
  currentActivityInstanceState: number;
  durationInMillis: number;
  durationInMillisFormat: string;
  startTime: string;
  endTime: string;
  multiInstance: boolean;
  multiInstanceList: ActMultiInstanceDto[];
  currentSequenceCounter: number;
  instanceDetailNum: number;
  currentDetail: ActInstanceDetailDto;
  instanceDetailList: ActInstanceDetailDto[];
}

export interface ActInstanceAndModelDto {
  diagramData: string;
  actInstanceMap: Map<string, ActInstanceDto>;
}

export interface InstanceApplyInfoDto {
  durationInMillis: number;
  durationInMillisFormat: string;
  processStartTime: string;
  processEndTime: string;
  startTitle: number;
  processCategory: string;
  processCategoryName: string;
  businessKey: string;
  processInstanceId: string;
  tenantId: string;
  finishState: number;
  processState: number;
  startFormData: Object;
  userInfo: Object;
  currentActivityName: string;
  currentActivityType: string;
  currentAssignee: string;
  currentTaskId: string;
  currentStartTime: string;
  currentEndTime: string;
  currentDurationInMillis: number;
  currentDurationInMillisFormat: string;
  currentId: string;
}

export interface ProcessUrgentVo {
  processInstanceId: string;
}

export interface ActInstanceInfoDto {
  diagramData: string;
  diagramName: string;
  processDefinitionKey: string;
  processDefinitionId: string;
  deploymentName: string;
  version: number;
  category: string;
  categoryName: string;
  actInstanceDetails: any[];
}

export interface ActInstanceModel {
  id: string;
  activityId: string;
  executionId: string;
  activityName: string;
  activityType: string;
  userTask: boolean;
  activityInstanceId: string;
  activityInstanceState: number;
  parentActivityInstanceId: string;
  taskId: string;
  taskAssignee: string;
  taskAssigneeInfo: ProcessUserModel;
  candidateUsers: ProcessUserModel[];
  candidateGroups: ProcessRoleModel[];
  durationInMillis: Number;
  durationInMillisFormat: string;
  startTime: string;
  endTime: number;
  dueDate: string;
  followUpDate: string;
  dueDateStr: string;
  dueFormatDate: string;
  followUpDateStr: string;
  followUpFormatDate: string;
  sequenceCounter: number;
  taskTitle: string;
  handleType: string;
  handleTypeDescribe: string;
  propertyInfo: Object;
  formModel: Object;
  approvalStatus: number;
  optionInfos: ApprovalInfoModel;
  owner: string;
  ownerUserInfo: ProcessUserModel;
}

export interface ActInstanceInfoModel {
  diagramData: string;
  diagramName: string;
  processDefinitionKey: string;
  processDefinitionId: string;
  processInstanceId: string;
  deploymentName: string;
  version: number;
  processState: number;
  finishState: number;
  suspended: boolean;
  startTitle: string;
  category: string;
  categoryName: string;
  actInstanceList: ActInstanceModel[];
  attachmentInfo: Object;
  startFormData: Object;
}

export interface InstanceUserTaskDto {
  id: string;
  taskId: string;
  assignee: string;
  assigneeUserInfo: ProcessUserModel;
  owner: string;
  ownerUserInfo: ProcessUserModel;
  handleType: string;
  handleTypeDescribe: string;
  taskTitle: string;
  propertyModel: UserTaskPropertyModel;
  candidateUsers: ProcessUserModel[];
  candidateGroups: ProcessRoleModel[];
  name: string;
  description: string;
  formModel: Object;
  dueDate: string;
  followUpDate: string;
  priority: number;
  parentTaskId: string;
  taskDefinitionKey: string;
  tenantId: string;
  durationInMillis: Number;
  durationInMillisFormat: string;
  startTime: string;
  endTime: string;
  dueDateStr: string;
  dueFormatDate: string;
  followUpDateStr: string;
  followUpFormatDate: string;
  activityInstanceId: string;
  activityId: string;
  activityInstanceState: number;
  parentActivityInstanceId: string;
  approvalStatus: string;
  optionInfos: ApprovalInfoModel;
  allCommentStr: string;
  sequenceCounter: number;
  multiInstance: boolean;
  multiInstanceTasks: InstanceUserTaskDto[];
}
