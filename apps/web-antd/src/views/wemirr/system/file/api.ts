import { defHttp } from '#/api/request';

export function GetList(query: any) {
  return defHttp.get('/suite/files', {
    params: query,
  });
}
export function AddObj(obj: any) {
  return defHttp.post('/suite/files', {
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.put(`/suite/files/${obj.id}`, obj);
}

export function DelObj(id: string) {
  return defHttp.delete(`/suite/files/${id}`);
}
