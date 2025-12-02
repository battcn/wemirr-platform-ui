import { defHttp } from '#/api/request';

export function GetPage(query: any) {
  return defHttp.get('/suite/generate-table-column/page', { params: query });
}

export function AddObj(form: any) {
  return defHttp.post('/suite/generate-table-column', form);
}

export function UpdateObj(row: any) {
  return defHttp.put(`/suite/generate-table-column/${row.id}/modify`, row);
}

export function DelObj(id: string) {
  return defHttp.delete(`/suite/generate-table-column/${id}`);
}

export function BatchUpdate(data: any[]) {
  return defHttp.put('/suite/generate-table-column/batch/modify', data);
}
