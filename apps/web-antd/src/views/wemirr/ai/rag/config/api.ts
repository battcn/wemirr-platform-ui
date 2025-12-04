import { defHttp } from '#/api/request';

export interface KnowledgeBasePageReq {
  current: number;
  size: number;
  column?: string;
  asc?: boolean;
  name?: string;
  description?: string;
}

export interface KnowledgeBasePageRep {
  id: number;
  name: string;
  description: string;
  topK: number;
  minScore: number;
  chatModelId: number;
  embeddingModelId: number;
  createdTime: string;
  updatedTime: string;
}

export interface KnowledgeBaseDetailRep {
  id: number;
  name: string;
  description: string;
  topK: number;
  minScore: number;
  chatModelId: number;
  embeddingModelId: number;
  createdTime: string;
  updatedTime: string;
}

export interface KnowledgeBaseSaveReq {
  name: string;
  description?: string;
  topK?: number;
  minScore?: number;
  chatModelId: number;
  embeddingModelId: number;
}

export interface DocumentUploadReq {
  knowledgeBaseId: number;
  file: File;
}

export const PageList = (params: KnowledgeBasePageReq) =>
  defHttp.get<{ records: KnowledgeBasePageRep[]; total: number }>(
    '/ai/knowledge-bases/page',
    { params },
  );

export const GetInfo = (id: number) =>
  defHttp.get<KnowledgeBaseDetailRep>(`/ai/knowledge-bases/${id}/detail`);

export const AddObj = (data: KnowledgeBaseSaveReq) =>
  defHttp.post('/ai/knowledge-bases', data);

export const UpdateObj = (id: number, data: KnowledgeBaseSaveReq) =>
  defHttp.put(`/ai/knowledge-bases/${id}`, data);

export const DelObj = (id: number) =>
  defHttp.delete(`/ai/knowledge-bases/${id}`);

export const UploadDocument = (id: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return defHttp.post(`/ai/knowledge-bases/${id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const VectorizeDocument = (documentId: number) =>
  defHttp.post(`/ai/knowledge-bases/documents/${documentId}/vectorize`);

// 获取聊天模型列表（用于下拉选择）
export const GetChatModels = () =>
  defHttp.get('/ai/models-config/page', {
    params: { current: 1, size: 1000, modelType: 'TEXT' },
  });

// 获取嵌入模型列表（用于下拉选择）
export const GetEmbeddingModels = () =>
  defHttp.get('/ai/models-config/page', {
    params: { current: 1, size: 1000, modelType: 'EMBEDDING' },
  });
