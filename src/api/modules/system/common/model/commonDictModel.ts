import { BasePageVo } from '/@/api/model/baseModel';

export interface CommonDictItemDto {
  itemId: string;
  dictId: string;
  itemText: string;
  itemValue: string | number;
  dictCode: string;
  sortOrder: number;
  label?: string;
  value?: string | number | boolean;
  dictName: string;
  dictType: number;
}

export interface CommonDictPageVo extends BasePageVo {
  keyword: string;
  dictStatus: number;
  dictType: number;
}

export interface CommonDictPageDto {
  dictId: string;
  dictName: string;
  dictCode: string;
  dictType: number;
  remark: string;
  createUserName: string;
  createTime: string;
  dictStatus: number;
}

export interface CommonDictVo {
  dictName: string;
  dictCode: string;
  dictType: number;
  dictStatus: string;
  remark: string;
}

export interface CommonDictItemPageVo extends BasePageVo {
  keyword: string;
  dictStatus: number;
  dictType: number;
}

export interface CommonDictItemPageDto {
  dictId: string;
  dictName: string;
  dictCode: string;
  dictType: number;
  remark: string;
  createUserName: string;
  createTime: string;
  dictStatus: number;
}

export interface CommonDictItemVo {
  dictName: string;
  dictCode: string;
  dictType: number;
  dictStatus: string;
  remark: string;
}
