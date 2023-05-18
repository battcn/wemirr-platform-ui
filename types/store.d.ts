import { ErrorTypeEnum } from "/@/enums/exceptionEnum";
import { MenuModeEnum, MenuTypeEnum } from "/@/enums/menuEnum";
import { RoleInfo } from "/@/api/sys/model/userModel";

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

export interface UserInfo {
  userId: string | number;
  companyName: string;
  tenantId: string | number;
  tenantCode: string | number;
  permissions: [];
  username: string;
  realName: string;
  nickName: string;
  avatar: string;
  description?: string;
  homePath?: string;
  roles: RoleInfo[];
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}
