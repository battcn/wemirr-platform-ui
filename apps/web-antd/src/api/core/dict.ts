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

export enum BusinessDictCode {
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
  return defHttp.get(`/iam/areas/trees`);
};

export enum LocalDictCode {
  WF_TASK_STATUS = 'WF_TASK_STATUS',
}

// 创建字典Map
const localDictMap = new Map();
// 初始化字典数据  danger
localDictMap.set(LocalDictCode.WF_TASK_STATUS, [
  { label: '待审批', value: '1', cssClass: '', listClass: 'primary' },
  { label: '审批通过', value: '2', cssClass: '', listClass: 'success' },
  { label: '已终止', value: '4', cssClass: '', listClass: 'danger' },
  { label: '已完成', value: '8', cssClass: '', listClass: 'success' },
]);

export const localDictList = (code: LocalDictCode) => {
  return localDictMap.get(code);
};
