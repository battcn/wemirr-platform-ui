import { defHttp } from "/@/utils/http/axios";
import { LoginPicture, TokenInfo, GetCaptchaCodeModel } from "./model/userModel";

import { ErrorMessageMode } from "/#/axios";
import { encryptByBase64 } from "@/utils/cipher";
import { UserInfo } from "#/store";

enum Api {
  Login = "/authority/oauth2/token",
  Logout = "/authority/oauth2/logout",
  GetUserInfo = "/authority/oauth2/userinfo",
  GetPermCode = "/authority/resources/permissions",
  GetCaptchaCode = "/authority/captcha",
  ChangeUserInfo = "/authority/oauth2/change_info",
}
/**
 * @description: 验证码登录
 */
export const loginPicture = (data: LoginPicture, mode: ErrorMessageMode = "none") => {
  return defHttp.post<TokenInfo>(
    {
      url: Api.Login,
      params: data,
      data: data,
      headers: {
        Authorization: "Basic " + encryptByBase64(data.client_id + ":" + data.client_secret),
      },
    },
    { errorMessageMode: mode },
  );
};

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<UserInfo>({ url: Api.GetUserInfo }, { errorMessageMode: "none" });
}

export function getCaptcha() {
  return defHttp.get<GetCaptchaCodeModel>({ url: Api.GetCaptchaCode });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.delete({ url: Api.Logout });
}

export function changeUserInfo(data: any) {
  return defHttp.put({ url: Api.ChangeUserInfo, data: data });
}
