import { defHttp } from '#/api/request';

export function save(obj: any) {
  return obj.id ? UpdateObj(obj) : AddObj(obj);
}
export function AddObj(obj: any) {
  return defHttp.post('/iam/org/create', obj);
}

export function UpdateObj(obj: any) {
  return defHttp.put(`/iam/org/${obj.id}/modify`, obj);
}

export function DelObj(id: any) {
  return defHttp.delete(`/iam/org/${id}`);
}
