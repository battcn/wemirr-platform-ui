import { defHttp } from '#/api/request';

export function saveFormDesign(id: any, data: any) {
  return defHttp.post(`/suite/online-model/${id}/form-design`, data);
}
export const getOnlineModelDetail = (id: string) => {
  return defHttp.get(`/suite/online-model/${id}/detail`);
};

export function getFastCrud(definitionKey: string) {
  return defHttp.get(`/suite/online-model/fast-crud`, {
    params: { definitionKey },
  });
}

export function getDetail(definitionKey: string) {
  return defHttp.get(`/suite/online-model/detail`, {
    params: { definitionKey },
  });
}

export function GetList(query: any) {
  return defHttp.request('/suite/online-form-data/page', {
    method: 'post',
    data: query,
  });
}

export function AddObj(obj) {
  return defHttp.request('/suite/online-form-data/create', {
    method: 'post',
    data: { definitionKey: obj.definitionKey, formData: { ...obj } },
  });
}

export function UpdateObj(obj) {
  return defHttp.request(`/suite/online-form-data/${obj.id}/modify`, {
    method: 'put',
    data: { definitionKey: obj.definitionKey, formData: { ...obj } },
  });
}
export function DelObj(id: any) {
  return defHttp.delete(`/suite/online-form-data/${id}`);
}
