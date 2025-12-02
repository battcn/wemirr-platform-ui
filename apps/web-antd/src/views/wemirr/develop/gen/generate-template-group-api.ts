import { defHttp } from '#/api/request';

export function GetPage(query: any) {
  return defHttp.get('/suite/generate-template-group/page', {
    params: query,
  });
}

export function AddObj(obj: any) {
  return defHttp.post('/suite/generate-template-group/create', obj);
}

export function UpdateObj(obj: any) {
  return defHttp.put(`/suite/generate-template-group/${obj.id}/modify`, obj);
}

export function GetList() {
  return defHttp.get('/suite/generate-template-group/list-all');
}

export function DelObj(id: string) {
  return defHttp.delete(`/suite/generate-template-group/${id}`);
}
