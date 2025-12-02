import { defHttp } from '#/api/request';

export function GetList(query: any) {
  return defHttp.post('/iam/users/page', query);
}

export function AddObj(obj: any) {
  return defHttp.post('/iam/users/create', obj);
}

export function UpdateObj(obj: any) {
  return defHttp.put(`/iam/users/${obj.id}`, obj);
}

export function DelObj(id: string) {
  return defHttp.delete(`/iam/users/${id}`);
}

export function ResetPassword(id: string) {
  return defHttp.put(`/iam/users/${id}/reset_password`);
}

export function ExportUser(query: any) {
  return defHttp.downloadFile('/iam/users/export', '用户列表.xlsx', {
    data: query,
    method: 'POST',
  });
}
