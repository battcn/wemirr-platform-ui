import { BasePageVo } from '/@/api/model/baseModel';
export interface ValidServiceInfoDto {
  label: string;
  value: string;
  serviceCode: string;
  disabled: string;
}
export interface InstancePageVo extends BasePageVo {
  serviceCode: string;
  groupName: string;
}
export interface ManageServicePageVo extends BasePageVo {
  serviceCode: string;
  serviceName: string;
  serviceState: number;
}

export interface ManageServicePageDto {
  serviceId: string;
  swaggerTag: string;
  swaggerDocUri: string;
  serviceCode: string;
  serviceName: string;
  isLoadBalancer: number;
  subscribeChange: number;
  noticeChange: number;
  noticeType: number;
  serviceMetadataJson: string;
  serviceState: number;
  noticeTemplateId: string;
  headUserName: string;
  headUserId: string;
  remark: string;
  createUserName: string;
  createTime: string;
  instanceNum: number;
  healthyNum: number;
  unhealthyNum: number;
}

export interface ManageServiceVo {
  swaggerConfigUrl: string;
  serviceCode: string;
  serviceName: string;
  isLoadBalancer: number;
  subscribeChange: number;
  noticeChange: number;
  noticeType: number;
  serviceMetadataJson: string;
  serviceState: number;
  noticeTemplateId: string;
  headUserName: string;
  headUserId: string;
  remark: string;
}

export interface SpecialUrlInfo {
  routeSpecialId: string;
  urlName: string;
  businessId?: string;
  urlType: string;
  specialType: number;
  requestMethod?: string;
  url: string;
  limitMethod: boolean;
  specialStatus: number;
  remark?: string;
}

export interface FilterInfo {
  filterId: string;
  filterType: string;
  rules: string;
  businessId: string;
  remark: string;
  createUserName: string;
  createTime: string;
  specialUrlInfos: SpecialUrlInfo[];
}

export interface ServiceInstancePageDto {
  instanceId: string;
  ip: string;
  port: number;
  healthy: boolean;
  enabled: boolean;
  metadata: Object;
}

export interface NacosUpdateInstanceVo {
  instanceId: string;
  type: number;
  serviceCode: string;
}
export interface ManageServiceFilterUrlDto {
  serviceId: string;
  swaggerTag: string;
  swaggerDocUri: string;
  serviceCode: string;
  serviceName: string;
  isLoadBalancer: number;
  subscribeChange: number;
  noticeChange: number;
  noticeType: number;
  serviceMetadataJson: string;
  serviceState: number;
  noticeTemplateId: string;
  headUserName: string;
  headUserId: string;
  remark: string;
  createUserName: string;
  createTime: string;
  filterInfos: FilterInfo[];
}

export interface ManageServiceDto {
  serviceId: string;
  swaggerConfigUrl: string;
  serviceCode: string;
  serviceName: string;
  isLoadBalancer: number;
  subscribeChange: number;
  noticeChange: number;
  noticeType: number;
  serviceMetadataJson: string;
  serviceState: number;
  noticeTemplateId: string;
  headUserName: string;
  headUserId: string;
  remark: string;
  createUserName: string;
  createTime: string;
}

export interface SystemStatDto {
  manageTotalService: number;
  notManageTotalService: number;
  healthyInstanceCount: number;
  noHealthyInstanceCount: number;
}
