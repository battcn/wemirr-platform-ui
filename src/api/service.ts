import { defHttp } from "@/utils/http/axios";

export const GET = async (url, query?) => {
  return await defHttp.request({ url: url, method: "GET", params: query });
};

export const POST = async (url, obj?) => {
  return await defHttp.request({ url: url, method: "POST", data: obj });
};

export const PUT = async (url, obj?) => {
  return await defHttp.request({ url: url, method: "PUT", data: obj });
};

export const DELETE = async (url: string, obj?: Object | null | undefined) => {
  return await defHttp.request({ url: url, method: "DELETE", data: obj });
};
