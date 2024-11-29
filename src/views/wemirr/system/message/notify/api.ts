import { defHttp } from "@/utils/http/axios";

export function GetList(query) {
  return defHttp.request({
    url: "iam/site_notifies/page",
    method: "get",
    params: query,
  });
}
export function AddObj(obj) {
  return defHttp.request({
    url: "iam/site_notifies",
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request({
    url: `iam/site_notifies/${obj.id}`,
    method: "put",
    data: obj,
  });
}

export function DelObj(id) {
  return defHttp.request({
    url: `iam/site_notifies/${id}`,
    method: "delete",
    data: { id },
  });
}

export function SearchReceiver(type, value) {
  return defHttp.request({
    url: `iam/site_notifies/${type}/receivers`,
    method: "get",
    params: { search: value },
  });
}

export function PublishMessage(id) {
  return defHttp.request({
    url: `iam/site_notifies/${id}/publish`,
    method: "patch",
    data: { id },
  });
}
