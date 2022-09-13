import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { ConstantDictModel } from './model/commonConstantModel';

/**
 * @description: 通过类型获取常量字典
 */
export const getListByConstantTypes = (constantTypes: String) =>
  defHttp.get<ConstantDictModel[]>({
    url: SysUrlPrefix.SYSTEM + '/common-constant-dict/select/{constantTypes}',
    params: { constantTypes },
  });
