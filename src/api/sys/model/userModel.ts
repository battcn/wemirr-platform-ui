/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}
/**
 * @description: 获取验证码
 */
export interface GetCaptchaByKeyParams {
  key: string;
}
/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  access_token: string;
  tenantId: string | number;
  avatar: string | number;
  role: RoleInfo;
}
export interface LoginPrincipalInfoModel {
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 头像
  description: string;
  // 邮箱
  email?: string;
  // 资源权限
  permissions?: [];

  roles: RoleInfo[];
}
/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 头像
  description: string;
  // 邮箱
  email?: string;
  // 资源权限
  permissions?: [];

  roles: RoleInfo[];
}
