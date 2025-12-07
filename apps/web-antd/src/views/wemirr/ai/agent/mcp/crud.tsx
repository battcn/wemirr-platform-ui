import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
} from '@fast-crud/fast-crud';

import { h } from 'vue';

import {
  ApiOutlined,
  ReloadOutlined,
  ToolOutlined,
} from '@ant-design/icons-vue';
import { dict } from '@fast-crud/fast-crud';
import { message, Modal } from 'ant-design-vue';

import * as api from './api';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  const { openToolsModal } = props.context || {};

  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => {
          return await api.PageList(query);
        },
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) =>
          await api.UpdateObj(form.id, form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      toolbar: {
        buttons: {},
      },
      search: {
        show: true,
        columns: {
          name: {
            title: '服务名称',
            type: 'text',
            search: { show: true },
          },
        },
      },
      form: {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        name: {
          title: '服务名称',
          type: 'text',
          search: { show: true },
          form: {
            rules: [{ required: true, message: '请输入服务名称' }],
            component: {
              placeholder: '请输入服务名称',
            },
          },
          column: { width: 180, ellipsis: true },
        },
        type: {
          title: '连接类型',
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: 'STDIO', label: 'STDIO', color: 'blue' },
              { value: 'SSE', label: 'SSE', color: 'green' },
            ],
          }),
          column: {
            width: 120,
          },
        },
        command: {
          title: 'STDIO命令',
          type: 'text',
          form: {
            // rules: [
            //   {
            //     required: true,
            //     message: '请输入STDIO命令',
            //     trigger: 'change',
            //   },
            // ],
            component: {
              placeholder: '例如: npx',
            },
            helper: 'STDIO模式下的可执行命令',
          },
          column: { show: false },
        },
        args: {
          title: 'STDIO参数',
          type: 'textarea',
          form: {
            component: {
              placeholder: '例如: ["@modelcontextprotocol/server-filesystem"]',
              rows: 3,
            },
            helper: 'JSON数组格式，例如: ["arg1", "arg2"]',
          },
          column: { show: false },
          // 将JSON字符串转换为格式化的文本用于显示
          valueBuilder({ value, row, key }: any) {
            if (value && typeof value === 'string') {
              try {
                const parsed = JSON.parse(value);
                row[key] = value; // 保持原始JSON字符串
              } catch {
                row[key] = value;
              }
            }
          },
        },
        url: {
          title: 'SSE URL',
          type: 'text',
          form: {
            // rules: [
            //   { required: true, message: '请输入SSE URL', trigger: 'change' },
            // ],
            component: {
              placeholder: '例如: http://localhost:3000/sse',
            },
            helper: 'SSE模式下的连接URL',
          },
          column: { show: false },
        },
        env: {
          title: '环境变量',
          type: 'textarea',
          form: {
            component: {
              placeholder: '例如: {"API_KEY": "your-key", "DEBUG": "true"}',
              rows: 3,
            },
            helper: 'JSON对象格式，例如: {"KEY": "value"}',
          },
          column: { show: false },
        },
        status: {
          title: '启用状态',
          type: 'dict-switch',
          form: {
            value: true,
            component: {
              checkedChildren: '启用',
              unCheckedChildren: '禁用',
            },
          },
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'default' },
            ],
          }),
          column: {
            width: 120,
          },
        },
      },
      rowHandle: {
        fixed: 'right',
        width: 280,
        buttons: {
          edit: {
            show: true,
            text: '编辑',
          },
          remove: {
            show: true,
            text: '删除',
            type: 'link',
            async click(context: any) {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除MCP服务"${context.row.name}"吗？`,
                okType: 'danger',
                onOk: async () => {
                  await context.doRemove();
                  message.success('删除成功');
                },
              });
            },
          },
          testConnection: {
            text: '测试连接',
            type: 'link',
            size: 'small',
            icon: () => h(ApiOutlined),
            title: '测试MCP连接',
            show: true,
            click: async ({ row }: any) => {
              const hide = message.loading('正在测试连接...', 0);
              try {
                const result = await api.TestConnection(row.id);
                hide();

                if (result.success) {
                  Modal.success({
                    title: '连接测试成功',
                    content: h('div', [
                      h('p', `服务器: ${result.serverName}`),
                      h('p', `可用工具数量: ${result.toolCount}`),
                      h('p', `响应时间: ${result.responseTime}ms`),
                    ]),
                  });
                } else {
                  Modal.error({
                    title: '连接测试失败',
                    content: h('div', [
                      h('p', { style: { color: 'red' } }, result.errorMessage),
                      h('p', `响应时间: ${result.responseTime}ms`),
                    ]),
                  });
                }
              } catch (error: any) {
                hide();
                Modal.error({
                  title: '连接测试失败',
                  content: error.message || '未知错误',
                });
              }
            },
            order: 1,
          },
          viewTools: {
            text: '查看工具',
            type: 'link',
            size: 'small',
            icon: () => h(ToolOutlined),
            title: '查看MCP工具',
            show: true,
            click: ({ row }: any) => {
              if (openToolsModal) {
                openToolsModal(row);
              } else {
                message.warning('工具查看功能暂不可用');
              }
            },
            order: 2,
          },
          refresh: {
            text: '刷新',
            type: 'link',
            size: 'small',
            icon: () => h(ReloadOutlined),
            title: '刷新MCP连接',
            show: true,
            click: async ({ row }: any) => {
              try {
                await api.RefreshConnection(row.id);
                message.success('刷新成功');
              } catch (error: any) {
                message.error(`刷新失败: ${error.message}`);
              }
            },
            order: 3,
          },
        },
      },
    },
  };
}
