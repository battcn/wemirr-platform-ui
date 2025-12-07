import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  EditReq,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import { message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';

import * as api from './api';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) => {
          return await api.pageList(query);
        },
        addRequest: async ({ form }: any) => {
          return await api.create(form);
        },
        editRequest: async ({ form }: EditReq) => {
          return await api.modify(form.id, form);
        },
        delRequest: async ({ row }: any) => {
          return await api.remove(row.id);
        },
      },
      // 删除table配置，只使用卡片布局
      table: {
        show: false,
      },
      actionbar: {
        buttons: {
          add: {
            text: '新增智能体',
            show: false,
          },
          export: {
            show: false,
          },
          import: {
            show: false,
          },
        },
      },
      rowHandle: {
        width: 160,
        buttons: {
          view: {
            show: true,
            text: '查看',
          },
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
                content: `确定要删除智能体"${context.row.name}"吗？`,
                okType: 'danger',
                onOk: async () => {
                  await context.doRemove();
                  message.success('删除成功');
                },
              });
            },
          },
        },
      },
      form: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        name: {
          title: '智能体名称',
          type: 'text',
          search: { show: true },
          form: {
            rules: [{ required: true, message: '请输入智能体名称' }],
            component: {
              placeholder: '请输入智能体名称',
            },
          },
          column: { width: 200 },
        },
        chatModelId: {
          title: '绑定模型',
          type: 'dict-select',
          search: { show: false },
          form: {
            rules: [{ required: true, message: '请选择绑定模型' }],
            component: {
              placeholder: '请选择模型',
              allowClear: true,
            },
          },
          dict: dict({
            getData: async () => {
              try {
                const res = await api.getModelList();
                return res.records || [];
              } catch (error) {
                console.error('获取模型列表失败:', error);
                return [];
              }
            },
            value: 'id',
            label: 'modelName',
          }),
          column: { width: 150 },
        },
        description: {
          title: '描述',
          type: 'textarea',
          form: {
            component: {
              placeholder: '请输入智能体描述',
              rows: 3,
              maxlength: 500,
              showCount: true,
            },
          },
          column: {
            width: 300,
            ellipsis: true,
          },
        },
        aiSystemMessage: {
          title: '角色预设',
          type: 'textarea',
          column: { show: false },
          form: {
            component: {
              placeholder: '请输入智能体的角色预设信息',
              rows: 4,
              maxlength: 2000,
              showCount: true,
            },
          },
        },
        avatar: {
          title: '头像',
          type: 'text',
          form: {
            show: false, // 在自定义新增组件中处理头像上传
          },
          column: {
            width: 80,
            component: {
              name: 'fs-avatar',
              vModel: 'src',
              size: 'small',
            },
          },
        },
        kbId: {
          title: '关联知识库',
          type: 'dict-select',
          form: {
            component: {
              placeholder: '请选择知识库',
              allowClear: true,
            },
          },
          dict: dict({
            getData: async () => {
              try {
                const res = await api.getKnowledgeBaseList();
                return res.records || [];
              } catch (error) {
                console.error('获取知识库列表失败:', error);
                return [];
              }
            },
            value: 'id',
            label: 'name',
          }),
          column: { width: 120 },
        },
        tools: {
          title: '工具配置',
          type: 'dict-select',
          column: {
            show: false,
          },
          form: {
            component: {
              mode: 'multiple',
              placeholder: '请选择工具',
              allowClear: true,
            },
          },
          dict: dict({
            getData: async () => {
              try {
                const res = await api.getTools();
                return res || [];
              } catch (error) {
                console.error('获取工具列表失败:', error);
                return [];
              }
            },
            value: 'beanName',
            label: 'beanName',
          }),
          // 值构建器：将JSON字符串解析为数组用于表单显示
          valueBuilder({ value, row, key }: any) {
            if (typeof value === 'string' && value) {
              try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                  row[key] = parsed;
                  return;
                }
              } catch {
                // 如果不是有效JSON，设为空数组
              }
            }
            row[key] = [];
          },
          // 值解析器：表单提交时将数组转换为JSON字符串存储
          valueResolve({ value }: any) {
            if (Array.isArray(value) && value.length > 0) {
              return JSON.stringify(value);
            }
            return ''; // 返回空字符串而不是null
          },
        },
        createdName: {
          title: '创建人',
          type: 'text',
          form: { show: false },
          column: { width: 120 },
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          form: { show: false },
          column: {
            width: 180,
            sorter: true,
          },
          valueBuilder({ value, row, key }: any): void {
            if (value) {
              row[key] = dayjs(value);
            }
          },
        },
        updatedTime: {
          title: '更新时间',
          type: 'datetime',
          form: { show: false },
          column: {
            width: 180,
            sorter: true,
          },
          valueBuilder({ value, row, key }: any): void {
            if (value) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
