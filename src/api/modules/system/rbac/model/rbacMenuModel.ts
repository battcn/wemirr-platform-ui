import { BasePageVo } from '/@/api/model/baseModel';

export interface RbacMenuPageVo extends BasePageVo {
  metaTitle: string;
  menuStatus: number;
  systemId: string;
}

export interface RbacMenuPageDto {
  menuId: string;
  parentId: string;
  path: string;
  component: string;
  pathName: string;
  menuType: number;
  iframe: boolean;
  menuStatus: number;
  metaTitle: string;
  actions: string;
  icon: string;
  iconType: number;
  orderNo: number;
  systemId: string;
  enableDelete: number;
  remark: string;
  createUserName: string;
  menuSysCode: string;
  createTime: string;
  children?: RbacMenuPageDto[];
  isLeaf: boolean;
  hasChildren: boolean;
}

export interface RbacMenuTreeDto {
  menuId: string;
  parentId: string;
  metaTitle: string;
  path: string;
  menuType: number;
  menuStatus: number;
  children?: RbacMenuTreeDto[];
  isLeaf: boolean;
  hasChildren: boolean;
}

export interface RbacMenuVo {
  parentId?: string;
  path?: string;
  component?: string;
  pathName?: string;
  redirect?: string;
  menuType: number;
  iframe?: boolean;
  iframeType: number;
  menuStatus: number;
  metaTitle: string;
  ignoreKeepAlive: boolean;
  affix: boolean;
  icon?: string;
  iconType?: number;
  frameSrc?: string;
  transitionName?: string;
  hideBreadcrumb?: boolean;
  carryParam?: boolean;
  hideChildrenInMenu?: boolean;
  currentActiveMenu?: string;
  hideTab?: boolean;
  hideMenu?: boolean;
  orderNo: number;
  ignoreRoute?: boolean;
  hidePathForChildren?: boolean;
  buttonAction?: string;
  systemId: string;
  remark?: string;
  type?: string;
  content?: string;
  dot?: boolean;
}

export interface RbacMenuDto {
  MenuId: string;
  parentId?: string;
  path?: string;
  component?: string;
  pathName?: string;
  redirect?: string;
  MenuType: number;
  iframe?: boolean;
  iframeType: number;
  menuStatus: number;
  metaTitle: string;
  ignoreKeepAlive: boolean;
  affix: boolean;
  icon?: string;
  iconType?: number;
  frameSrc?: string;
  transitionName?: string;
  hideBreadcrumb?: boolean;
  carryParam?: boolean;
  hideChildrenInMenu?: boolean;
  currentActiveMenu?: string;
  hideTab?: boolean;
  hideMenu?: boolean;
  orderNo: number;
  ignoreRoute?: boolean;
  hidePathForChildren?: boolean;
  buttonAction?: string;
  systemId?: string;
  enableDelete: number;
  menuSysCode: string;
  createUserName: string;
  createTime: string;
  type?: string;
  content?: string;
  dot?: boolean;
  remark?: string;
}
