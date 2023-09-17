import { defHttp } from "@/utils/http/axios";

export function BatchDelete(ids) {
  return defHttp.request({
    url: `/authority/site_messages/batch_remove`,
    method: "delete",
    data: ids,
  });
}
