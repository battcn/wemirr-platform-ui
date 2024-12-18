import { defHttp } from '#/api/request';

export function GetList(query: any) {
  return defHttp.get(`/iam/product_definitions/page`, { params: query });
}
export function AddObj(form: any) {
  return defHttp.post(`/iam/product_definitions`, form);
}

export function UpdateObj(form: any) {
  return defHttp.put(`/iam/product_definitions/${form.id}`, form);
}

export function DelObj(id: string) {
  return defHttp.delete(`/iam/product_definitions/${id}`);
}

export function GetPermissionResByProductId(productId: string) {
  return defHttp.get(`/iam/product_definitions/${productId}/permissions`, {
    params: { productId },
  });
}

export function DistributionRoleAuthority(form: any) {
  return defHttp.put(
    `/iam/product_definitions/${form.productId}/permissions`,
    form,
  );
}
