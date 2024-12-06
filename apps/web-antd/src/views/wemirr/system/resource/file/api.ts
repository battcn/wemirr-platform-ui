import { defHttp } from '#/api/request';

export function GetList(query: any) {
  return defHttp.get('/tools/files', {
    params: query,
  });
}
export function AddObj(obj: any) {
  return defHttp.post('/tools/files', {
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.put(`/tools/files/${obj.id}`, obj);
}

export function DelObj(id: string) {
  return defHttp.delete(`/tools/files/${id}`);
}
