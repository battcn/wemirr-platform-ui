import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Logout = '/logout',
  Login = '/authority/oauth/token',
  GetUserInfo = '/authority/oauth/info',
  GetPermCode = '/getPermCode',
  LoadCaptcha = '/authority/captcha',
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
  // return defHttp.get({ url: Api.Logout });
}
