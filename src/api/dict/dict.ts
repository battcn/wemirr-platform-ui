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
    url: `iam/dict/${code}/list`,
  });
};

export const businessDictFunc = (code: BusinessDictCode) => {
  return dict({
    url: `iam/tenant_dict/${code}/list`,
  });
};
