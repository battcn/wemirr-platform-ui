import { defHttp } from "@/utils/http/axios";

export function BatchDelete(ids) {
  return defHttp.request({
    url: `/authority/station_messages`,
    method: "delete",
    data: ids,
  });
}
