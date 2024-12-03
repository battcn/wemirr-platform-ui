import { defHttp } from '#/api/request';

export function GetList(query) {
  return defHttp.request("/iam/message_templates/page",{
    method: "get",
    params: query,
  });
}
export function AddObj(obj) {
  return defHttp.request("/iam/message_templates/create",{
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request(`/iam/message_templates/${obj.id}/modify`,{
    method: "put",
    data: obj,
  });
}

export function DelObj(id) {
  return defHttp.request( `/iam/message_templates/${id}`,{
    method: "delete",
    data: { id },
  });
}

export function notify(obj: any) {
  return defHttp.post("/iam/message_templates/notify",obj);
}