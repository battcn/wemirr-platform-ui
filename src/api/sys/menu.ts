import { defHttp } from "@/utils/http/axios";
import { getMenuListResultModel } from "./model/menuModel";
import { GetPermissionListModel } from "@/api/sys/model/roleModel";
enum Api {
  GetMenuList = "/authority/resources/router",
}

/**
 * @description: Get user menu based on id
 */

export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};

export const GetPermissionList = (roleId: number) => {
  return defHttp.get<GetPermissionListModel>({
    url: `/authority/roles/${roleId}/permissions`,
    params: { roleId: roleId },
  });
};
