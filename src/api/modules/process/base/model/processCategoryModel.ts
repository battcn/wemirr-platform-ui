import { BasePageVo } from '/@/api/model/baseModel';

export interface ProcessCategoryPageVo extends BasePageVo {
  categoryName?: string;
  categoryState?: number;
}

export interface ProcessCategoryPageDto {
  categoryId: string;
  categoryCode: string;
  categoryName: string;
  categoryState: number;
  pictures: string;
  categoryDescribe: string;
  remark: string;
  createUserId: string;
  createUserName: string;
  createTime: string;
}

export interface ProcessCategoryDto {
  categoryId: string;
  categoryCode: string;
  categoryName: string;
  categoryState: number;
  slots?: Record<string, string>;
  pictures: string;
  categoryDescribe: string;
  remark: string;
  createUserId: string;
  createUserName: string;
  createTime: string;
}

export interface ProcessCategoryVo {
  categoryCode: string;
  categoryName: string;
  categoryState: number;
  pictures?: string;
  categoryDescribe?: string;
  remark?: string;
}

export interface ProcessCategoryQueryVo {
  categoryCode?: string;
  categoryName?: string;
  categoryState?: number;
}
