import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  DesignModelHistoryPageVo,
  DesignModelHistoryPageDto,
  DesignModelHistoryDto,
  DeleteHistoryDesignModelVo,
} from './model/designModelHistoryModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: DesignModelHistoryPageVo) =>
  defHttp.post<PageDto<DesignModelHistoryPageDto>>({
    url: SysUrlPrefix.PROCESS + '/design-model/history/select/page',
    data,
  });

/**
 * @description: 通过历史模型id查询详情
 */
export const getById = (historyModelId: string) =>
  defHttp.get<DesignModelHistoryDto>({
    url: SysUrlPrefix.PROCESS + '/design-model/history/select/one/{historyModelId}',
    params: { historyModelId },
  });

/**
 * @description: 删除模型
 */
export const deleteByModel = (data: DeleteHistoryDesignModelVo) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.PROCESS + '/design-model/history/delete/model',
      data,
    },
    { successMessageMode: 'notification' }
  );
