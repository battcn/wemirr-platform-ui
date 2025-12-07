import { defHttp } from '#/api/request';

export interface McpServerConfigPageReq {
  current: number;
  size: number;
  column?: string;
  asc?: boolean;
  name?: string;
  status?: boolean;
}

export interface McpServerConfig {
  id: number;
  name: string;
  type: string; // STDIO/SSE
  command?: string;
  args?: string; // JSON字符串
  url?: string;
  env?: string; // JSON字符串
  status: boolean;
  createdTime?: string;
  updatedTime?: string;
}

export interface McpServerConfigSaveReq {
  name: string;
  type: string;
  command?: string;
  args?: string;
  url?: string;
  env?: string;
  status?: boolean;
}

export interface McpConnectionTestResult {
  success: boolean;
  errorMessage?: string;
  serverName?: string;
  toolCount?: number;
  responseTime?: number;
}

export interface McpToolInfo {
  name: string;
  description?: string;
}

// 分页查询
export const PageList = (params: McpServerConfigPageReq) =>
  defHttp.get<{ records: McpServerConfig[]; total: number }>('/ai/mcp-server', {
    params,
  });

// 新增配置
export const AddObj = (data: McpServerConfigSaveReq) =>
  defHttp.post('/ai/mcp-server', data);

// 修改配置
export const UpdateObj = (id: number, data: McpServerConfigSaveReq) =>
  defHttp.put(`/ai/mcp-server/${id}`, data);

// 删除配置
export const DelObj = (id: number) => defHttp.delete(`/ai/mcp-server/${id}`);

// 刷新连接
export const RefreshConnection = (id: number) =>
  defHttp.patch(`/ai/mcp-server/${id}/refresh`);

// 测试连接
export const TestConnection = (id: number) =>
  defHttp.post<McpConnectionTestResult>(`/ai/mcp-server/${id}/test-connection`);

// 获取工具列表
export const GetTools = (id: number) =>
  defHttp.get<McpToolInfo[]>(`/ai/mcp-server/${id}/tools`);

// 切换启用状态
export const ToggleStatus = (id: number, status: boolean) =>
  defHttp.patch(`/ai/mcp-server/${id}/status`, null, {
    params: { status },
  });
