import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { ValidateDto } from './model/loginCommonModel';

/**
 * @description: 退出登录
 */
export const loginOut = () => defHttp.get<string>({ url: SysUrlPrefix.AUTH + '/logout' });

/**
 * @description: 踢用户下线
 */
export const kickOut = (loginUnique: string) =>
  defHttp.post<string>({ url: SysUrlPrefix.AUTH + `/kick-out/${loginUnique}` });

/**
 * @description: 获取图片验证码
 */
export const getPictureCode = () =>
  defHttp.get<ValidateDto>({ url: SysUrlPrefix.AUTH + '/code/picture' });
