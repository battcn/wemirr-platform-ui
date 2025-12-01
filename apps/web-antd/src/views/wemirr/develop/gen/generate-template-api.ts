import { defHttp } from '#/api/request';

export function pageObj(query: any) {
  return defHttp.get('/suite/generate-template/page', { params: query });
}
export function createObj(form: any) {
  return defHttp.post('/suite/generate-template/create', form);
}
export function editObj(row: any) {
  return defHttp.put(`/suite/generate-template/${row.id}/modify`, row);
}

export function delObj(id: string) {
  return defHttp.delete(`/suite/generate-template/${id}`);
}
