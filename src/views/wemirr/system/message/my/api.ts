import { defHttp } from "@/utils/http/axios";

export function PageList(query: any) {
  return defHttp.get({
    url: "/authority/site_messages/page",
    params: query,
  });
}

export function BatchDelete(ids: any) {
  return defHttp.delete({
    url: `/authority/site_messages/batch_remove`,
    data: ids,
  });
}

export function DelObj(id: string) {
  return defHttp.delete({
    url: `/authority/site_messages/${id}`,
    data: { id },
  });
}
