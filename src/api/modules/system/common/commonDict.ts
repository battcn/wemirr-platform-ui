import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { PageDto } from '/@/api/model/baseModel';
import {
  CommonDictItemDto,
  CommonDictPageVo,
  CommonDictPageDto,
  CommonDictVo,
  CommonDictItemPageVo,
  CommonDictItemVo,
  CommonDictItemPageDto,
} from './model/commonDictModel';

/**
 * @description: 通过编码获取数据字典
 */
export const getListByCode = (dictCode: String) =>
  defHttp.get<CommonDictItemDto[]>({
    url: SysUrlPrefix.SYSTEM + '/common-dict/select/by-code/{dictCode}',
    params: { dictCode: dictCode },
  });

/**
 * @description: 分页查询
 */
export const selectPage = (data: CommonDictPageVo) =>
  defHttp.post<PageDto<CommonDictPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/common-dict/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: CommonDictVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/common-dict/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: CommonDictVo, dictId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/common-dict/update/{dictId}',
    data: { ...data, dictId },
  });

/**
 * @description: 分页查询
 */
export const selectItemPage = (data: CommonDictItemPageVo) =>
  defHttp.post<PageDto<CommonDictItemPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/common-dict/select/item-page',
    data,
  });

/**
 * @description: 新增
 */
export const insertItem = (data: CommonDictItemVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/common-dict/insert-item',
    data,
  });

/**
 * @description: 修改
 */
export const updateItem = (data: CommonDictItemVo, itemId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/common-dict/update-item/{itemId}',
    data: { ...data, itemId },
  });

/**
 * @description: 数据字典表逻辑删除
 */
export const deleteById = (dictId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/common-dict/delete-one/{dictId}',
      params: { dictId },
    },
    { successMessageMode: 'notification' }
  );

/**
 * @description: 数据字典配置项表逻辑删除
 */
export const deleteItem = (itemId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/common-dict/delete-item-one/{itemId}',
      params: { itemId },
    },
    { successMessageMode: 'notification' }
  );
