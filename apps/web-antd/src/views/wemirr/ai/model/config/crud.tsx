import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  ValueBuilderContext,
  ValueResolveContext,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';

import * as api from './api';

export default function crud({}: CreateCrudOptionsProps): CreateCrudOptionsRet {
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
      search: {
        show: true,
        columns: {
          modelName: {
            title: '模型名称',
            type: 'text',
            search: { show: true },
          },
          provider: {
            title: '提供商',
            type: 'dict-select',
            search: { show: true },
            dict: dict({
              data: [
                { value: 'OpenAI', label: 'OpenAI' },
                { value: 'DeepSeek', label: '深度求索' },
                { value: 'Anthropic', label: 'Anthropic' },
                { value: 'Google', label: 'Google' },
                { value: 'Azure', label: 'Azure' },
                { value: 'Ollama', label: 'Ollama' },
              ],
            }),
          },
          modelType: {
            title: '模型类型',
            type: 'dict-select',
            search: { show: true },
            dict: dict({
              data: [
                { value: 'TEXT', label: '文本' },
                { value: 'EMBEDDING', label: '向量' },
                { value: 'IMAGE', label: '图像' },
                { value: 'AUDIO', label: '音频' },
              ],
            }),
          },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        modelName: {
          title: '模型名称',
          type: 'text',
          search: { show: true },
          column: { ellipsis: true, width: 200 },
        },
        provider: {
          title: '提供商',
          type: 'dict-select',
          search: { show: true },
          column: { ellipsis: true, width: 150 },
          dict: dict({
            data: [
              { value: 'OpenAI', label: 'OpenAI' },
              { value: 'DeepSeek', label: '深度求索' },
              { value: 'Anthropic', label: 'Anthropic' },
              { value: 'Google', label: 'Google' },
              { value: 'Azure', label: 'Azure' },
              { value: 'Ollama', label: 'Ollama' },
            ],
          }),
        },
        modelType: {
          title: '模型类型',
          type: 'dict-select',
          column: { ellipsis: true, width: 120 },
          dict: dict({
            data: [
              { value: 'TEXT', label: '文本' },
              { value: 'EMBEDDING', label: '向量' },
              { value: 'IMAGE', label: '图像' },
              { value: 'AUDIO', label: '音频' },
            ],
          }),
        },
          apiKey: {
            title: 'API密钥',
            type: 'text',
            column: { ellipsis: true, width: 120 },
          },
        baseUrl: {
          title: '基础URL',
          type: 'text',
          column: { ellipsis: true, width: 120  },
        },
        createName: {
          title: '创建人',
          type: 'text',
          form: { show: false },
          column: { ellipsis: true, width: 160 },
        },
        createTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
          column: { width: 180 },
        },
        variables: {
          title: '配置属性',
          type: 'json',
          form: {
            col: { span: 24 },
            helper: '可选，JSON 格式，如 {"key":"value"}',
            valueBuilder({ form }: ValueBuilderContext) {
              if (form.variables == null) {
                return;
              }
              form.variables = JSON.parse(form.variables);
            },
            valueResolve({ form }: ValueResolveContext) {
              if (form.variables == null) {
                return;
              }
              form.variables = JSON.stringify(form.variables);
            },
          },
        },
      },
      rowHandle: {
        fixed: 'right',
        width: 200,
        buttons: {
          edit: {
            show: true,
          },
          remove: {
            show: true,
          },
        },
      },
    },
  };
}
