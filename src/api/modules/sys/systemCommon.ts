import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { CommonInitSystemModel } from './model/systemCommonModel';
/**
 * @description: 获取系统按钮权限信息
 */
export const getSystemInitInfo = (systemCodes: string) =>
  defHttp.get<CommonInitSystemModel>({
    url: SysUrlPrefix.SYSTEM + '/common-system/init/system-info',
    params: { systemCodes },
  });
