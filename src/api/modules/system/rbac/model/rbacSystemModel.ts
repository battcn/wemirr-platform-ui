import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree';
import { BasePageVo } from '/@/api/model/baseModel';
export interface RbacSystemDto extends TreeDataItem {
  systemId: string;
  systemName: string;
  systemCode: string;
  systemDescribe: string;
  remark: string;
}

export interface RbacSystemVo {
  systemId: string;
}

export interface RbacSystemPageVo extends BasePageVo {
  systemId: string;
}

export interface RbacSystemPageDto {
  systemId: string;
}
