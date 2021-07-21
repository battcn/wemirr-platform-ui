import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel, ChangePassword } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Logout = '/authority/oauth/logout',
  Login = '/authority/oauth/token',
  GetUserInfo = '/authority/oauth/info',
  GetPermCode = '/getPermCode',
  LoadCaptcha = '/authority/captcha',
  ChangePassword = '/authority/oauth/change_password',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.get<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo });
}

export function getPermCode() {
  // return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.delete({ url: Api.Logout });
}

export function changePassword(params: ChangePassword) {
  return defHttp.put({ url: Api.ChangePassword, data: params });
}
