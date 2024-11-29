import { OrgListItem, OrgListGetResultModel } from "@/api/model/systemModel";
import { defHttp } from "@/utils/http/axios";

enum Api {
  OrgList = "iam/org/trees?parentId=0",
}

export const getOrgList = (params?: OrgListItem) =>
  defHttp.get<OrgListGetResultModel>({ url: Api.OrgList, params });
