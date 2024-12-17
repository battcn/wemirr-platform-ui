import type { CreateCrudOptionsRet } from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';

export default function (): CreateCrudOptionsRet {
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: any) =>
          await defHttp.get(`/suite/file-storage/setting/page`, {
            params: query,
          }),
        addRequest: async ({ form }: any) =>
          await defHttp.post(`/suite/file-storage/setting`, form),
        editRequest: async ({ form }: any) =>
          await defHttp.put(
            `/suite/file-storage/setting/${form.id}/modify`,
            form,
          ),
        delRequest: async ({ row }: any) =>
          await defHttp.delete(`/suite/file-storage/setting/${row.id}`),
      },
      rowHandle: { fixed: 'right' },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        type: {
          title: '存储类型',
          type: 'dict-select',
          column: { show: true, width: 180, component: { color: 'auto' } },
          dict: dict({
            data: [
              { value: 's3', label: '标准S3协议' },
              { value: 'minio', label: 'minio' },
              { value: 'aliyun', label: '阿里云' },
              { value: 'qiniu', label: '七牛云' },
              { value: 'tenxun', label: '腾讯云' },
              { value: 'huawei', label: '华为云' },
            ],
          }),
        },
        domain: {
          title: '访问域名',
          type: 'textarea',
          column: { width: 200, ellipsis: true },
          form: {
            col: {
              span: 24,
            },
            helper: '注意“/”结尾，例如：http://minio.abc.com/abc/',
            rules: [{ required: true, message: '请输入访问域名' }],
          },
        },
        bucketName: {
          title: '桶名称',
          type: 'textarea',
          column: { width: 160, ellipsis: true },
          form: {
            col: {
              span: 24,
            },
            rules: [{ required: true, message: '请输入桶名称' }],
          },
        },
        accessKey: {
          title: 'AccessKey',
          type: 'textarea',
          column: { show: true, width: 240, ellipsis: true },
          form: {
            col: {
              span: 24,
            },
            rules: [{ required: true, message: '请输入访问key' }],
          },
        },
        secretKey: {
          title: 'SecretKey',
          type: ['password'],
          column: { show: false, width: 120, ellipsis: true },
          form: {
            col: {
              span: 24,
            },
            rules: [{ required: true, message: '请输入SecretKey' }],
          },
        },
        basePath: {
          title: '基础路径',
          type: 'text',
          column: { width: 160, ellipsis: true },
          form: {
            helper: '例如:test/\n文件路径由访问域名和基础路径拼接而成',
            rules: [{ required: true, message: '请输入基础路径' }],
          },
        },
        endPoint: {
          title: '连接终端',
          type: 'textarea',
          column: { width: 200, ellipsis: true },
          form: {
            col: {
              span: 24,
            },
            helper: '例如:http://host:9000',
            rules: [{ required: true, message: '请输入endPoint' }],
          },
        },
        status: {
          title: '状态',
          search: { show: true },
          addForm: { value: false },
          column: { show: true, width: 100 },
          type: ['dict-radio'],
          dict: dict({
            data: [
              { value: true, label: '启用', color: 'success' },
              { value: false, label: '禁用', color: 'error' },
            ],
          }),
        },
        createdTime: {
          title: '创建时间',
          type: 'datetime',
          form: { show: false },
          column: { show: true, width: 180 },
          valueBuilder({ value, row, key }) {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
      },
    },
  };
}
