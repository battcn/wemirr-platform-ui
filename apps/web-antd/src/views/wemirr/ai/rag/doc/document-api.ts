import { defHttp } from '#/api/request';

export interface DocumentPageReq {
  current: number;
  size: number;
  column?: string;
  asc?: boolean;
  knowledgeBaseId?: number;
  name?: string;
  vectorized?: boolean;
}

export interface DocumentPageRep {
  id: number;
  knowledgeBaseId: number;
  name: string;
  originalFilename: string;
  fileSize: number;
  contentType: string;
  vectorized: boolean;
  fileUrl: string;
  ext: string;
  brief: string;
  createdTime: string;
  updatedTime: string;
}

export interface DocumentDetailRep {
  id: number;
  knowledgeBaseId: number;
  name: string;
  originalFilename: string;
  fileSize: number;
  contentType: string;
  vectorized: boolean;
  fileUrl: string;
  ext: string;
  brief: string;
  content: string;
  createdTime: string;
  updatedTime: string;
}

// 获取文档列表（按知识库ID）
export const GetDocumentsByKnowledgeBase = (
  knowledgeBaseId: number,
  params?: DocumentPageReq,
) =>
  defHttp.get<{ records: DocumentPageRep[]; total: number }>(
    `/ai/knowledge-bases/${knowledgeBaseId}/documents`,
    { params },
  );

// 获取文档详情
export const GetDocumentDetail = (documentId: number) =>
  defHttp.get<DocumentDetailRep>(`/ai/documents/${documentId}/detail`);

// 删除文档
export const DeleteDocument = (documentId: number) =>
  defHttp.delete(`/ai/documents/${documentId}`);

// 上传文档到知识库
export const UploadDocument = (knowledgeBaseId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return defHttp.post(
    `/ai/knowledge-bases/${knowledgeBaseId}/documents`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

// 向量化文档
export const VectorizeDocument = (documentId: number) =>
  defHttp.post(`/ai/knowledge-bases/documents/${documentId}/vectorize`);

// 批量向量化文档
export const BatchVectorizeDocuments = (documentIds: number[]) =>
  defHttp.post('/ai/knowledge-bases/documents/batch-vectorize', {
    documentIds,
  });
