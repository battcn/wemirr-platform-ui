import { BasePageVo } from '/@/api/model/baseModel';

export interface RbacClientDetailsPageVo extends BasePageVo {
  clientId: string;
  clientName: string;
  clientStatus: number;
}

export interface RbacClientDetailsPageDto {
  clientDetailId: string;
  clientId: string;
  clientName: string;
  clientIco: string;
  signatureRequired: number;
  signatureKey: string;
  singleLogin: number;
  singleLoginType: number;
  innerSystem: number;
  lastAuthTime: string;
  limitError: number;
  maxErrorNum: number;
  clientStatus: number;
  accessTokenValiditySeconds: number;
  refreshTokenValiditySeconds: number;
  remark: string;
  createUserName: string;
  createTime: string;
  havaScoped: number;
  webRegisteredRedirectUri: string;
  havaAutoApprove: number;
  codeValiditySeconds: number;
}

export interface RbacClientDetailsVo {
  clientId: string;
  clientSecurity: string;
  clientName: string;
  clientIco: string;
  limitResource: number;
  resourceIds: string[];
  signatureRequired: number;
  signatureKey: string;
  authorizedGrantTypes: string[];
  singleLogin: number;
  singleLoginType: number;
  endpoints: string[];
  innerSystem: number;
  lastAuthTime: string;
  limitError: number;
  maxErrorNum: number;
  clientStatus: number;
  accessTokenValiditySeconds: number;
  refreshTokenValiditySeconds: number;
  additionalInformation: Object;
  remark: string;
  havaScoped: number;
  scopes: string[];
  webRegisteredRedirectUri: string;
  havaAutoApprove: number;
  codeValiditySeconds: number;
}

export interface RbacClientDetailsDto {
  clientDetailId: string;
  clientId: string;
  clientSecurity: string;
  clientName: string;
  clientIco: string;
  limitResource: number;
  resourceIds: string[];
  signatureRequired: number;
  signatureKey: string;
  authorizedGrantTypes: string[];
  singleLogin: number;
  singleLoginType: number;
  endpoints: string[];
  innerSystem: number;
  lastAuthTime: string;
  limitError: number;
  maxErrorNum: number;
  clientStatus: number;
  accessTokenValiditySeconds: number;
  refreshTokenValiditySeconds: number;
  additionalInformation: Object;
  remark: string;
  createUserName: string;
  createTime: string;
  havaScoped: number;
  scopes: string[];
  webRegisteredRedirectUri: string;
  havaAutoApprove: number;
  codeValiditySeconds: number;
  clientResourceApiIds: string[];
  clientResourceApiInfos: any[];
  roleIds: string[];
  roleInfos: any[];
}

export interface RbacClientResetDto {
  clientDetailId: string;
  clientSecurity: string;
}

export interface RbacClientResourceApiPageVo extends BasePageVo {
  resourceId: string;
  apiUriAll: string;
  apiTagName: string;
}

export interface RbacClientAuthVo {
  roleIds: string[];
  clientResourceApiIds: string[];
}
