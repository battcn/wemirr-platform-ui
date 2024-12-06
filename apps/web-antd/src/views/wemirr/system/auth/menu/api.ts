import { defHttp } from '#/api/request';

export function GetResourceList(query: any) {
  return defHttp.request('/iam/resources/page', {
    method: 'get',
    params: query,
  });
}
export function SaveOrUpdate(obj: any) {
  return obj.id ? UpdateObj(obj) : AddObj(obj);
}
export function AddObj(obj: any) {
  return defHttp.request('/iam/resources/create', {
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.request(`/iam/resources/${obj.id}/modify`, {
    method: 'put',
    data: obj,
  });
}

export function DelObj(id: any) {
  return defHttp.request(`/iam/resources/${id}`, {
    method: 'delete',
    data: { id },
  });
}

export function GetBuildStandardList(query: any) {
  return defHttp.request('/tools/dynamic_release_drag', {
    method: 'get',
    params: query,
  });
}
