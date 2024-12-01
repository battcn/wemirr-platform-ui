import { defHttp } from '#/api/request';

export function PageList(query: any) {
  return defHttp.get("/iam/site_messages/page",{
    params: query,
  });
}

export function BatchDelete(ids: any) {
  return defHttp.delete( `/iam/site_messages/batch_remove`,{
    data: ids,
  });
}

export function DelObj(id: string) {
  return defHttp.delete(`/iam/site_messages/${id}`,{
    data: { id },
  });
}
