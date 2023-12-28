import { defHttp } from "@/utils/http/axios";

export const GET = async (url: string, query?: any) => {
  return await defHttp.request({ url: url, method: "GET", params: query });
};

export const POST = async (url: string, obj?: any) => {
  return await defHttp.request({ url: url, method: "POST", data: obj });
};

export const PUT = async (url: string, obj?: any) => {
  return await defHttp.request({ url: url, method: "PUT", data: obj });
};

export const DELETE = async (url: string, obj?: Object | null | undefined) => {
  return await defHttp.request({ url: url, method: "DELETE", data: obj });
};
