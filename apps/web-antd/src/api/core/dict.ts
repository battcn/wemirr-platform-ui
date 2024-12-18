import { dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';

export enum SysDictCode {
  EDUCATION = 'EDUCATION',
  INDUSTRY = 'INDUSTRY',
  NATION = 'NATION',
  NOTICE = 'NOTICE',
  SEX = 'SEX',
  STATUS = 'STATUS',
}

export const enum BusinessDictCode {
  // 能源类型
  TMS_ENERGY_TYPE = 'TMS_ENERGY_TYPE',
  // 能源类型
  TMS_EXPENSE_ITEM = 'TMS_EXPENSE_ITEM',
  TMS_PLATE_COLOR = 'TMS_PLATE_COLOR',

  WMS_SCAN_OPERATION_TYPE = 'WMS_SCAN_OPERATION_TYPE',

  // 仓库类型
  WMS_WAREHOUSE_TYPE = 'WMS_WAREHOUSE_TYPE',
}

export const sysDictFunc = (code: SysDictCode) => {
  return dict({
    url: `/iam/dict/${code}/list`,
  });
};

export const businessDictFunc = (code: BusinessDictCode) => {
  return dict({
    url: `/iam/tenant-dict/${code}/list`,
  });
};

export const getAreaTree = () => {
  return defHttp.get(`/iam/areas/trees`).then((ret) => ret.data);
};
