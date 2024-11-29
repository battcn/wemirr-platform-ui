import { AreaTreeGetResultModel } from "../model/systemModel";
import { defHttp } from "@/utils/http/axios";

enum Api {
  AreaList = "iam/areas/trees",
  ProvinceList = "iam/areas/0/children",
}

export const getAreaTree = () => defHttp.get<AreaTreeGetResultModel>({ url: Api.AreaList });
export const getProvinceList = () => defHttp.get<AreaTreeGetResultModel>({ url: Api.ProvinceList });
