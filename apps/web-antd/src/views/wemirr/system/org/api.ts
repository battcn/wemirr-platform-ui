import { defHttp } from '#/api/request';

export function GetList(query: any) {
  return defHttp.get("/iam/org/trees",{ params :query });
}


export function SaveOrUpdate(obj: any) {
  if (obj.id) {
    return UpdateObj(obj);
  } else {
    return AddObj(obj);
  }
}
export function AddObj(obj: any) {
  return defHttp.post("/iam/org",obj);
}

export function UpdateObj(obj: any) {
  return defHttp.put( `/iam/org/${obj.id}`,obj);
}

export function DelObj(id: any) {
  return defHttp.delete(`/iam/org/${id}`);
}
