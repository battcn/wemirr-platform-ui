import { BasePageVo } from '/@/api/model/baseModel';

export interface DesignExpressionPageVo extends BasePageVo {
  keyword: string;
  handleType: number;
  expressionType: number;
  expressionState: number;
}

export interface DesignExpressionPageDto {
  handleType: number;
  implementClass: string;
  example: string;
  remark: string;
  expressionName: string;
  expressionType: number;
  elExpressionValue: string;
  expressionState: number;
  createUserName: string;
  createTime: string;
}

export interface DesignExpressionVo {
  handleType: number;
  implementClass: string;
  example: string;
  remark: string;
  expressionName: string;
  expressionType: number;
  elExpressionValue: string;
  expressionState: number;
}
