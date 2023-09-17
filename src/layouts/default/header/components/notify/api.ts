import { defHttp } from "@/utils/http/axios";

export function MarkMessage(id) {
  return defHttp.request({
    url: `/authority/site_messages/${id}/mark`,
    method: "patch",
  });
}
