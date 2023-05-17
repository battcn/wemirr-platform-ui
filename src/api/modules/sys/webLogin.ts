import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { ErrorMessageMode } from '/#/axios';
import { LoginPicture, LoginSms } from './model/webLoginModel';
import { TokenInfo } from 'types/store';

/**
 * @description: 验证码登录
 */
export const loginPicture = (params: LoginPicture, mode: ErrorMessageMode = 'none') => {
  // params.grant_type = 'picture_code';
  params.grant_type = 'password';
  params.client_id = 'client';
  params.client_secret = 'client';
  params.scope = 'server';
  // params.tenant_code = '0000'
  // params.scope = 'web';
  return defHttp.post<TokenInfo>(
    { url: SysUrlPrefix.AUTH + '/oauth/token', params },
    { errorMessageMode: mode },
  );
};

/**
 * @description: 短信登录
 */
export const loginSmsCode = (params: LoginSms) =>
  defHttp.post<TokenInfo>({ url: SysUrlPrefix.AUTH + '/web/login/sms', params });
