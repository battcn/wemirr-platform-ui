import { dict } from '@fast-crud/fast-crud';

import { defHttp } from '#/api/request';

export default function crud() {
  const pageRequest = async (query: any) =>
    await defHttp.get('/suite/generates', { params: query });

  const editRequest = async ({ form }: any) =>
    await defHttp.put(`/suite/generates/${form.id}`, form);
  const delRequest = async ({ row }: any) =>
    await defHttp.delete(`/suite/generates/${row.id}`);
  const addRequest = async ({ form }: any) =>
    await defHttp.post('/suite/generates', form);
  return {
    crudOptions: {
      request: {
        pageRequest,
        editRequest,
        delRequest,
        addRequest,
      },
      table: {
        scroll: { fixed: true },
      },
      rowHandle: {
        width: 260,
        fixed: 'right',
        buttons: {
          download: {
            type: 'link',
            text: '代码生成',
            size: 'small',
            title: '代码生成',
            async click({ row }: any) {
              await defHttp.downloadFile(
                `/suite/generates/${row.id}/download`,
                `${row.moduleName}.zip`,
                {
                  method: 'POST',
                },
              );
            },
          },
          remove: { order: 2 },
        },
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        tableName: {
          title: '表名',
          type: 'dict-select',
          dict: dict({
            url: '/suite/generates/tables',
          }),
          column: { width: 160, component: { color: 'auto' } },
          form: {
            rules: [{ required: true, message: '表名不能为空' }],
            component: {
              showSearch: true,
              filterOption(inputValue, option) {
                return (
                  option.label.includes(inputValue) ||
                  option.value.includes(inputValue)
                );
              },
            },
          },
        },
        tablePrefix: {
          title: '表前缀',
          type: 'text',
          column: { width: 100 },
          form: {
            helper: '文件前缀擦除(t_ => t_user => User)',
          },
        },
        moduleName: {
          title: '模块名',
          type: 'text',
          column: { width: 120 },
          form: {
            rules: [{ required: true, message: '模块名不能为空' }],
          },
        },
        parentPackage: {
          title: '父包',
          type: 'text',
          column: { width: 200, ellipsis: true },
          form: {
            rules: [{ required: true, message: '父包不能为空' }],
          },
        },
        apiUrlPrefix: {
          title: 'API前缀',
          type: 'text',
          column: { width: 180 },
          form: {
            rules: [{ required: true, message: 'API前缀不能为空' }],
          },
        },
        springdoc: {
          title: 'Swagger',
          type: 'dict-radio',
          form: { value: true },
          dict: dict({
            data: [
              { value: true, label: '是', color: 'success' },
              { value: false, label: '否', color: 'error' },
            ],
          }),
          column: { width: 100 },
        },
        rootDir: {
          title: '根目录',
          type: ['textarea'],
          column: { width: 200, ellipsis: true },
          form: {
            col: {
              span: 24,
            },
          },
        },
        author: {
          title: '作者',
          type: 'text',
          search: { show: true },
          column: { width: 150, ellipsis: true },
          form: {
            rules: [{ required: true, message: '作者不能为空' }],
            helper: '默认当前登录人昵称',
          },
        },
        createTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
