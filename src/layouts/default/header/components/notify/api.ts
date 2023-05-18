import { defHttp } from "@/utils/http/axios";

export function MarkMessage(id) {
  return defHttp.request({
    url: `/authority/station_messages/${id}/mark`,
    method: "patch",
  });
}
