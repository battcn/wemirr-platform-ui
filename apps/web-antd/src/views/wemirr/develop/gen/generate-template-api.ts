import { defHttp } from '#/api/request';

export function pageObj(query: any) {
  return defHttp.get('/suite/gennerate-template/page', { params: query });
}
export function createObj(form: any) {
  return defHttp.post('/suite/gennerate-template/create', form);
}
export function editObj(row: any) {
  return defHttp.put(`/suite/gennerate-template/${row.id}/modify`, row);
}

export function delObj(id: string) {
  return defHttp.delete(`/suite/gennerate-template/${id}`);
}

