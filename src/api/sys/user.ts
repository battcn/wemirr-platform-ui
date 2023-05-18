import { defHttp } from "/@/utils/http/axios";
import { LoginPicture, TokenInfo, GetUserInfoModel } from "./model/userModel";

import { ErrorMessageMode } from "/#/axios";

enum Api {
  Login = "/authority/oauth/token",
  Logout = "/authority/oauth/logout",
  GetUserInfo = "/authority/oauth/info",
  GetPermCode = "/authority/resources/permissions",
  TestRetry = "/testRetry",
}
/**
 * @description: 验证码登录
 */
export const loginPicture = (data: LoginPicture, mode: ErrorMessageMode = "none") => {
  data.grant_type = "password";
  data.client_id = "client";
  data.client_secret = "client";
  data.scope = "server";
  return defHttp.post<TokenInfo>(
    { url: Api.Login, params: data, data: data },
    { errorMessageMode: mode }
  );
};

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: "none" });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.delete({ url: Api.Logout });
}
