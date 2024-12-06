import { dict } from '@fast-crud/fast-crud';
import {defHttp} from "#/api/request";

export enum SysDictCode {
  EDUCATION = 'EDUCATION',
  INDUSTRY = 'INDUSTRY',
  NATION = 'NATION',
  NOTICE = 'NOTICE',
  SEX = 'SEX',
  STATUS = 'STATUS',
}

export const enum BusinessDictCode {
  DEMO = 'DEMO',
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


export const getAreaTree = ()=>{
  return defHttp.get(`/iam/areas/trees`,);
}
