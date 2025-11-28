import { defHttp } from '#/api/request';

export function GetResourceList(query: any) {
  return defHttp.request('/iam/resources/page', {
    method: 'get',
    params: query,
  });
}
export function GetList(query: any) {
  return defHttp.get(`/iam/plan-definitions/page`, { params: query });
}
export function AddObj(form: any) {
  return defHttp.post(`/iam/plan-definitions`, form);
}

export function UpdateObj(form: any) {
  return defHttp.put(`/iam/plan-definitions/${form.id}`, form);
}

export function DelObj(id: string) {
  return defHttp.delete(`/iam/plan-definitions/${id}`);
}

export function getPermResByplanId(planId: string) {
  return defHttp.get(`/iam/plan-definitions/${planId}/permissions`, {
    params: { planId },
  });
}

export function assignResource(form: any) {
  return defHttp.put(`/iam/plan-definitions/${form.planId}/permissions`, form);
}
