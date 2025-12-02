import { defHttp } from '#/api/request';

export function GetPage(query: any) {
  return defHttp.get('/suite/generate-template/page', { params: query });
}

export function GetList() {
  return defHttp.get('/suite/generate-template/list-all');
}

export function GetDetail(id: string) {
  return defHttp.get(`/suite/generate-template/${id}/detail`);
}

export function AddObj(form: any) {
  return defHttp.post('/suite/generate-template/create', form);
}

export function UpdateObj(row: any) {
  return defHttp.put(`/suite/generate-template/${row.id}/modify`, row);
}

export function DelObj(id: string) {
  return defHttp.delete(`/suite/generate-template/${id}`);
}
