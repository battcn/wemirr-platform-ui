import { defHttp } from '#/api/request';

export function GetPage(query: any) {
  return defHttp.get('/suite/generate-table/page', { params: query });
}

export function AddObj(form: any) {
  return defHttp.post('/suite/generate-table', form);
}

export function UpdateObj(row: any) {
  return defHttp.put(`/suite/generate-table/${row.id}/modify`, row);
}

export function DelObj(id: string) {
  return defHttp.delete(`/suite/generate-table/${id}`);
}

export function DownloadFile(id: string) {
  return defHttp.downloadFile(
    `/suite/generate-table/${id}/download`,
    `generated-table.zip`,
    {
      method: 'POST',
    },
  );
}

export function PreviewCode(id: string) {
  return defHttp.get(`/suite/generate-table/${id}/preview`);
}

export function GetDsList(params: any) {
  return defHttp.get('/suite/generate-table/ds/list', { params });
}

export function ImportDs(tables: any[]) {
  return defHttp.post('/suite/generate-table/ds/import', tables);
}
