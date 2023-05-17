import {
  AccountParams,
  OrgListItem,
  MenuParams,
  RoleParams,
  RolePageParams,
  MenuListGetResultModel,
  OrgListGetResultModel,
  AccountListGetResultModel,
  RolePageListGetResultModel,
  RoleListGetResultModel
} from '../model/systemModel'
import { defHttp } from '@/utils/http/axios'

enum Api {
  AccountList = '/system/getAccountList',
  // https://cloud.battcn.com/api/authority/org/trees?parentId=0
  OrgList = '/authority/org/trees?parentId=0',
  setRoleStatus = '/system/setRoleStatus',
  MenuList = '/system/getMenuList',
  RolePageList = '/system/getRoleListByPage',
  GetAllRoleList = '/authority/roles/query_all'
}

export const getAccountList = (params: AccountParams) => defHttp.get<AccountListGetResultModel>({ url: Api.AccountList, params })

export const getOrgList = (params?: OrgListItem) => defHttp.get<OrgListGetResultModel>({ url: Api.OrgList, params })

export const getMenuList = (params?: MenuParams) => defHttp.get<MenuListGetResultModel>({ url: Api.MenuList, params })

export const getRoleListByPage = (params?: RolePageParams) => defHttp.get<RolePageListGetResultModel>({ url: Api.RolePageList, params })

export const getAllRoleList = (params?: RoleParams) => defHttp.get<RoleListGetResultModel>({ url: Api.GetAllRoleList, params })

export const setRoleStatus = (id: number, status: string) => defHttp.post({ url: Api.setRoleStatus, params: { id, status } })
