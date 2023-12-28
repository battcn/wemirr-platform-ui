import { dict } from "@fast-crud/fast-crud";

export enum DictCode {
  INDUSTRY = "INDUSTRY",
  NOTICE = "NOTICE",
  SEX = "SEX",
  NATION = "NATION",
  EDUCATION = "EDUCATION",
}
export const dictFunc = (code: DictCode) => {
  return dict({
    url: `/authority/dictionaries/${code}/list`,
  });
};
