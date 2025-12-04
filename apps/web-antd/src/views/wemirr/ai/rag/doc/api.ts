import { defHttp } from '#/api/request';

export interface DocumentPageReq {
  current: number;
  size: number;
  column?: string;
  asc?: boolean;
  knowledgeBaseId?: number;
  title?: string;
  originalFilename?: string;
  ext?: string;
  vectorized?: number; // 修改为number类型: 0-未向量化，1-向量化成功，2-向量化中，-1-向量化失败
}

export interface DocumentPageRep {
  id: number;
  knowledgeBaseId: number;
  title: string;
  originalFilename: string;
  fileSize: number;
  contentType: string;
  vectorized: number; // 修改为number类型: 0-未向量化，1-向量化成功，2-向量化中，-1-向量化失败
  fileUrl: string;
  ext: string;
  brief: string;
  createdTime: string;
  updatedTime: string;
}

export interface DocumentDetailRep {
  id: number;
  knowledgeBaseId: number;
  title: string;
  originalFilename: string;
  fileSize: number;
  contentType: string;
  vectorized: number; // 修改为number类型: 0-未向量化，1-向量化成功，2-向量化中，-1-向量化失败
  fileUrl: string;
  ext: string;
  brief: string;
  content: string;
  createdTime: string;
  updatedTime: string;
}

export interface DocumentModifyReq {
  title: string;
  brief?: string;
}

// 向量化状态响应
export interface VectorizeStatusRep {
  documentId: number;
  vectorized: number; // 0-未向量化，1-向量化成功，2-向量化中，-1-向量化失败
  message?: string;
  updatedTime?: string;
}

// 分页获取文档列表
export const PageList = (params: DocumentPageReq) => {
  const { knowledgeBaseId, ...queryParams } = params;

  return defHttp.get<{ records: DocumentPageRep[]; total: number }>(
    `/ai/rag-documents/${knowledgeBaseId}/page`,
    { params: queryParams },
  );
};

// 获取文档详情
export const GetInfo = (documentId: number) =>
  defHttp.get<DocumentDetailRep>(`/ai/rag-documents/${documentId}/detail`);

// 修改文档
export const UpdateObj = (id: number, data: DocumentModifyReq) =>
  defHttp.put(`/ai/rag-documents/${id}`, data);

// 删除文档
export const DelObj = (id: number) => defHttp.delete(`/ai/rag-documents/${id}`);

// 上传文档到知识库
export const UploadDocument = (knowledgeBaseId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('kbId', knowledgeBaseId.toString());
  return defHttp.post('/ai/rag-documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 提交文档向量化任务(异步)
export const VectorizeDocument = (documentId: number) =>
  defHttp.post<string>(`/ai/vectorization/knowledge-item/${documentId}`);

// 查询文档向量化状态
export const GetVectorizeStatus = (documentId: number) =>
  defHttp.get<VectorizeStatusRep>(
    `/ai/rag-documents/${documentId}/vectorize-status`,
  );

// 批量向量化文档
export const BatchVectorizeDocuments = (documentIds: number[]) =>
  defHttp.post('/ai/rag-documents/batch-vectorize', { documentIds });
