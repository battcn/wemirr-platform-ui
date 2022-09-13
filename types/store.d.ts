import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '/@/enums/menuEnum';

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined;
  // Is it locked?
  isLock?: boolean;
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum;
  // Error file
  file: string;
  // Error name
  name?: string;
  // Error message
  message: string;
  // Error stack
  stack?: string;
  // Error detail
  detail: string;
  // Error url
  url: string;
  // Error time
  time?: string;
}

export interface RoleInfo {
  roleCode: string;
  roleId: string;
  roleName: string;
}
export interface UserInfo {
  userId: string;
  userName: string;
  phone: string;
  nickName?: string;
  shortProfile?: string;
  realName?: string;
  avatar?: string;
  birthday?: string;
  sex: number;
  email: string;
  currentDepartId: string;
  currentDepartName: string;
  homePath?: string;
  roleCodes: string[];
  roleIds: string[];
  roleInfos: RoleInfo[];
  superAdmin: boolean;
  currentAreaCode: string;
  currentAreaName: string;
  currentOrgCode: string;
  currentOrgId: string;
  currentOrgName: string;
  currentTenantId: string;
}

export interface TokenInfo {
  access_token: string;
  refresh_token: string;
  endpoint: string;
  scope: string;
  token_type: string;
  tenantCode: string;
  expires_in: number;
}

export interface WebSecurityModel {
  validityInSeconds: number;
  expiresAt: string;
  publicKey: string;
  serialNumber: string;
  serialNumberKey: string;
  refreshHeaderKey: string;
  ciphertextKey: string;
  secretKey: string;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
