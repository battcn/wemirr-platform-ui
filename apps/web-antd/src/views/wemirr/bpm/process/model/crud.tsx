import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { useRouter } from 'vue-router';

import { compute, dict } from '@fast-crud/fast-crud';
import { notification } from 'ant-design-vue';

import { DelObj, Deploy, PageList } from './api';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  const router = useRouter();
  const { crudExpose } = props;
  const { diagramRef } = props.context;
  return {
    crudOptions: {
      table: {},
      request: {
        pageRequest: async (query: any) => await PageList(query),
        delRequest: async ({ row }) => await DelObj(row.id, { cascade: true }),
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {
          add: {
            icon: '',
            text: '创建模型',
            async click() {
              await router.push('/bpm/process/design');
            },
          },
        },
      },
      rowHandle: {
        align: 'left',
        width: 300,
        buttons: {
          edit: {
            async click({ row }) {
              await router.push(`/bpm/process/design?modelId=${row.id}`);
            },
          },
          view: {
            async click({ row }) {
              await diagramRef.value.openPreview({ modelId: row.id });
            },
          },
          form: {
            type: 'link',
            text: '表单设计',
            size: 'small',
            title: '表单设计',
            order: 1,
            async click({ row }) {
              const routeUrl = router.resolve({
                path: `/bpm/process/form-design?modelId=${row.id}`,
                query: { modelId: `${row.id}` },
              });
              await router.push(routeUrl);
            },
          },
          deploy: {
            type: 'link',
            text: '部署',
            size: 'small',
            title: '部署',
            order: 5,
            show: compute(({ row }) => {
              return row.status !== 1;
            }),
            async click({ row }) {
              await Deploy(row.id).then(() => {
                notification.success({ message: '部署成功', duration: 3 });
                crudExpose.doRefresh();
              });
            },
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
        definitionKey: {
          title: '流程定义KEY',
          type: 'text',
          column: { width: 230 },
        },
        diagramName: {
          title: '流程定义名',
          type: 'text',
          search: { show: true },
          column: { width: 230 },
        },
        categoryId: {
          title: '模型类别',
          type: 'dict-select',
          search: { show: true },
          dict: dict({
            url: '/bpm/process_categories/list',
            label: 'name',
            value: 'id',
          }),
          column: { show: false },
        },
        categoryCode: {
          title: '分类编码',
          type: 'text',
          search: { show: false },
          column: { width: 100 },
        },
        categoryName: {
          title: '分类名称',
          type: 'text',
          column: { width: 160 },
        },
        status: {
          title: '状态',
          search: { show: true },
          column: { width: 120, show: true, align: 'center' },
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: 2, label: '新版本待部署', color: 'warning' },
              { value: 1, label: '已经部署', color: 'success' },
              { value: 0, label: '未部署', color: 'error' },
            ],
          }),
        },
        version: {
          title: '版本',
          type: 'text',
          column: { width: 100, show: true, align: 'center' },
        },
        createdName: {
          title: '创建人',
          search: { show: false },
          type: 'text',
          addForm: { show: false },
          editForm: { show: false },
          column: { width: 170, ellipsis: true },
        },
        createdTime: {
          title: '创建时间',
          type: ['datetime', 'wp-readonly-time'],
        },
      },
    },
  };
}
