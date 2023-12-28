import { defHttp } from "@/utils/http/axios";

export function SaveOrUpdate(obj: any) {
  if (obj.id) {
    return UpdateObj(obj);
  } else {
    return AddObj(obj);
  }
}
export function AddObj(obj: any) {
  return defHttp.post({
    url: "/authority/org",
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.put({
    url: `/authority/org/${obj.id}`,
    data: obj,
  });
}

export function DelObj(id: any) {
  return defHttp.delete({
    url: `/authority/org/${id}`,
    data: { id },
  });
}
