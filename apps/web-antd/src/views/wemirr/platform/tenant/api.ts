import { defHttp } from '#/api/request';

export function getTenantSetting(tenantId: any) {
  return defHttp.get(`/iam/tenants/${tenantId}/setting`);
}
export function setTenantSetting(data: any) {
  return defHttp.put(`/iam/tenants/${data.tenantId}/setting`, data);
}
