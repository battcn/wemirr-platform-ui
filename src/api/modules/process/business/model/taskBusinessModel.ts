import { BasePageVo } from '/@/api/model/baseModel';
import { ActInstanceInfoModel } from './processBusinessModel';
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

export interface QueryTimeVo {
  startTime: string;
  endTime: string;
}
export interface TaskQueryPageVo extends BasePageVo {
  processTitle: string;
  applyUserName: string;
  taskName: string;
  description: string;
  businessKey: string;
  applyUserOrgId: string;
  category: string;
  processFormEquals: Object;
  processFormLike: Object;
  processFormTime: Map<string, QueryTimeVo>;
  taskFormEquals: Object;
  taskFormLike: Object;
  taskFormTime: Map<string, QueryTimeVo>;
}

export interface TaskWaitPageDto {
  dueTime: string;
  followUpTime: string;
  processTitle: string;
  parentTaskId: string;
  processName: string;
  processCategory: string;
  processCategoryName: string;
  applyUserName: string;
  applyUserInfo: ProcessHandleUserModel;
  applyTime: string;
  createTime: string;
  taskName: string;
  priority: number;
  description: string;
  taskId: string;
  businessKey: string;
  processInstanceId: string;
  processDefinitionId: string;
  taskDefinitionKey: string;
  claim: boolean;
  delegationStates: number;
  suspensionState: number;
  enableUnClaim: boolean;
  taskTitle: string;
}

export interface ProcessSubmitResultModel {
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

export interface TaskHistoryPageDto {
  dueDate: string;
  followUpDate: string;
  processTitle: string;
  parentTaskId: string;
  processName: string;
  applyUserName: string;
  applyTime: string;
  applyUserInfo: ProcessHandleUserModel;
  processCategory: string;
  processCategoryName: string;
  durationInMillis: number;
  durationInMillisFormat: string;
  startTime: string;
  endTime: string;
  category: string;
  categoryName: string;
  taskName: string;
  priority: number;
  description: string;
  taskId: string;
  businessKey: string;
  processInstanceId: string;
  processDefinitionId: string;
  taskDefinitionKey: string;
  taskTitle: string;
  approvalStatus: number;
  allCommentStr: string;
  optionInfos: ApprovalInfoModel;
}

export interface SubmitFormModel {
  value: Object;
  time: string;
  timeFormat: string;
}
export interface SubmitParentTaskModel {
  taskId: string;
  taskFormData?: Object;
  taskVariables?: Object;
  processFormData?: Map<String, SubmitFormModel>;
  processVariables?: Object;
}
export interface TaskHistoryQueryPageVo extends BasePageVo {
  processTitle: string;
  applyUserName: string;
  taskName: string;
  description: string;
  businessKey: string;
  applyUserOrgId: string;
  category: string;
  processFormEquals: Object;
  processFormLike: Object;
  processFormTime: Map<string, QueryTimeVo>;
  taskFormEquals: Object;
}

export interface SubmitApprovalModel {
  approvalStatus: number;
  approvalOpinion: string;
  attachmentInfos: any[];
}

export interface CompleteTaskModel {
  approvalModel: SubmitApprovalModel;
  taskId: string;
}

export interface EnableDismissVo {
  processInstanceId: string;
  taskId: string;
}

export interface EnableDismissDto {
  activityName: string;
  description: string;
  activityId: string;
  disabled: boolean;
  sequenceCounter: number;
  activityType: string;
}

export interface DismissTaskModel extends SubmitParentTaskModel {
  taskDefinitionKey: string;
  approvalOpinion: string;
  originalApprover: boolean;
}

export interface UserTaskPropertyInfoModel {
  assignee: string;
  skillFullAssignee: string;
  skillFullAssigneeExtendId: string;
  skillFullApplicant: boolean;
  skillfullApplicantAutoSkip: boolean;
  skillFullAssigneeType: number;
  candidateGroups: string;
  skillFullCandidateGroups: string;
  skillFullCandidateGroupsExtendId: string;
  skillFullCandidateGroupsType: number;
  skillFullCandidateOrg: string;
  skillFullCandidateOrgName: string;
  skillFullCandidateOrgType: number;
  skillFullCandidateArea: string;
  skillFullCandidateAreaName: string;
  skillFullCandidateAreaType: number;
  skillFullCandidateButtonsExtendId: string;
  skillFullCandidateButtonsName: string;
  candidateUsers: string;
  skillFullCandidateUsers: string;
  skillFullCandidateUsersExtendId: string;
  skillFullCandidateUsersType: number;
  skillfullUserTaskButtons: string[];
}

export interface WaitUserTaskDetailModel {
  eventName: string;
  formKey: string;
  mustClaim: boolean;
  formJsonInfo: string;
  dueTime: string;
  followUpTime: string;
  taskId: string;
  name: string;
  taskTitle: string;
  description: string;
  createTime: string;
  propertyInfo: UserTaskPropertyInfoModel;
  instanceInfoModel: ActInstanceInfoModel;
}
