import { defHttp } from '#/api/request';

// 与后端 ModelType 枚举保持一致
export type ModelType = 'AUDIO' | 'EMBEDDING' | 'IMAGE' | 'TEXT';

export interface ModelConfigPageReq {
  current: number;
  size: number;
  column?: string;
  asc?: boolean;
  modelName?: string;
  provider?: string;
  modelType?: ModelType;
}

export interface ModelConfigPageRep {
  id: number;
  provider: string;
  modelType: ModelType;
  modelName: string;
  baseUrl: string;
  createName: string;
  createTime: string; // 后端 Instant，前端按字符串接收
}

export interface ModelConfigDetailRep {
  id: number;
  provider: string;
  modelType: ModelType;
  modelName: string;
  apiKey: string;
  baseUrl: string;
  variables?: Record<string, any>;
}

export interface ModelConfigSaveReq {
  provider: string;
  modelType: ModelType;
  modelName: string;
  apiKey: string;
  baseUrl?: string;
  variables?: Record<string, any>;
}

export const PageList = (params: ModelConfigPageReq) =>
  defHttp.get<ModelConfigPageRep>('/ai/models-config/page', { params });

export const GetInfo = (id: number) =>
  defHttp.get<ModelConfigDetailRep>(`/ai/models-models-config/${id}/detail`);

export const AddObj = (data: ModelConfigSaveReq) =>
  defHttp.post('/ai/models-config', data);

export const UpdateObj = (id: number, data: ModelConfigSaveReq) =>
  defHttp.put(`/ai/models-config/${id}`, data);

export const DelObj = (id: number) => defHttp.delete(`/ai/models-config/${id}`);
