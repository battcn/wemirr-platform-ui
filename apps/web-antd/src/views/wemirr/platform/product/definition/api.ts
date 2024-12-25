import { defHttp } from '#/api/request';

export function GetResourceList(query: any) {
  return defHttp.request('/iam/resources/page', {
    method: 'get',
    params: query,
  });
}
export function GetList(query: any) {
  return defHttp.get(`/iam/product-definitions/page`, { params: query });
}
export function AddObj(form: any) {
  return defHttp.post(`/iam/product-definitions`, form);
}

export function UpdateObj(form: any) {
  return defHttp.put(`/iam/product-definitions/${form.id}`, form);
}

export function DelObj(id: string) {
  return defHttp.delete(`/iam/product-definitions/${id}`);
}

export function getPermResByProductId(productId: string) {
  return defHttp.get(`/iam/product-definitions/${productId}/permissions`, {
    params: { productId },
  });
}

export function assignResource(form: any) {
  return defHttp.put(
    `/iam/product-definitions/${form.productId}/permissions`,
    form,
  );
}
