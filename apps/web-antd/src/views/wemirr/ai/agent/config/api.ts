import { defHttp } from '#/api/request';

// 智能体分页查询
export function pageList(params: any) {
  return defHttp.get('/ai/chat-agent/page', { params });
}

// 获取智能体详情
export function getDetail(id: number) {
  return defHttp.get(`/ai/chat-agent/${id}/detail`);
}

// 新增智能体
export function create(data: any) {
  return defHttp.post('/ai/chat-agent', data);
}

// 修改智能体
export function modify(id: number, data: any) {
  return defHttp.put(`/ai/chat-agent/${id}`, data);
}

// 删除智能体
export function remove(id: number) {
  return defHttp.delete(`/ai/chat-agent/${id}`);
}

// 上传头像
export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return defHttp.post('/ai/chat-agent/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// 获取可用工具类列表
export function getTools() {
  return defHttp.get('/ai/tools');
}

// 获取知识库列表（分页接口，设置大页数）
export function getKnowledgeBaseList() {
  return defHttp.get('/ai/knowledge-bases/page', {
    params: { current: 1, size: 1000 },
  });
}

// 获取模型列表（分页接口，设置大页数）
export function getModelList() {
  return defHttp.get('/ai/models-config/page', {
    params: { current: 1, size: 1000 },
  });
}

// 将工具类名称列表转换为配置JSON
export function convertToolClassNamesToConfig(toolClassNames: string[]) {
  return defHttp.post('/ai/tools/classes/convert', toolClassNames);
}
