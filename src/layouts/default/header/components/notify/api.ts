import { defHttp } from "@/utils/http/axios";

export function MarkMessage(id) {
  return defHttp.request({
    url: `iam/site_messages/${id}/mark`,
    method: "patch",
  });
}
