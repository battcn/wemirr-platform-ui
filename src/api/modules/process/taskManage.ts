import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  DesignModelPageVo,
  DesignModelPageDto,
  DesignModelVo,
  DesignModelDto,
  DesignModelBpmnDataVo,
  DesignModelDeploymentStatiDto,
} from './model/taskManageModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: DesignModelPageVo) =>
  defHttp.post<PageDto<DesignModelPageDto>>({
    url: SysUrlPrefix.PROCESS + '/design-model/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: DesignModelVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.PROCESS + '/design-model/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: DesignModelVo, modelId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.PROCESS + '/design-model/update/{modelId}',
    data: { ...data, modelId },
  });

/**
 * @description: 详情
 */
export const getById = (modelId: string) =>
  defHttp.get<DesignModelDto>({
    url: SysUrlPrefix.PROCESS + '/design-model/select/one/{modelId}',
    params: { modelId },
  });

/**
 * @description: 保存模型数据
 */
export const saveModelData = (data: DesignModelBpmnDataVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.PROCESS + '/design-model/save-model-data',
    data: { ...data },
  });

/**
 * @description: 模型部署情况统计
 */
export const statistics = () =>
  defHttp.get<DesignModelDeploymentStatiDto>({
    url: SysUrlPrefix.PROCESS + '/design-model/stati',
  });
