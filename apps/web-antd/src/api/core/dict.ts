import { dict } from '@fast-crud/fast-crud';

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
    url: `/iam/tenant_dict/${code}/list`,
  });
};
