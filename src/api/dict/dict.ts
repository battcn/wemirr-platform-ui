import { dict } from "@fast-crud/fast-crud";

export enum SysDictCode {
  INDUSTRY = "INDUSTRY",
  NOTICE = "NOTICE",
  SEX = "SEX",
  NATION = "NATION",
  EDUCATION = "EDUCATION",
  STATUS = "STATUS",
}

export const enum BusinessDictCode {}

export const sysDictFunc = (code: SysDictCode) => {
  return dict({
    url: `/authority/dict/${code}/list`,
  });
};

export const businessDictFunc = (code: BusinessDictCode) => {
  return dict({
    url: `/authority/tenant_dict/${code}/list`,
  });
};
