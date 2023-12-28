import { defHttp } from "@/utils/http/axios";

export function GetList(query: any) {
  return defHttp.get({
    url: "/tools/files",
    params: query,
  });
}
export function AddObj(obj: any) {
  return defHttp.post({
    url: "/tools/files",
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.put({
    url: `/tools/files/${obj.id}`,
    data: obj,
  });
}

export function DelObj(id: string) {
  return defHttp.delete({
    url: `/tools/files/${id}`,
    data: { id },
  });
}
