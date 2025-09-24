import type {
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
} from '@fast-crud/fast-crud';

import { useRouter } from 'vue-router';

import { compute, dict } from '@fast-crud/fast-crud';
import { notification } from 'ant-design-vue';

import { DelObj, PageList, Publish, UnPublish } from './api';

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
              await router.push(`/bpm/process/design?defId=${row.id}`);
            },
          },
          view: {
            async click({ row }) {
              await diagramRef.value.openPreview({ defId: row.id });
            },
          },
          form: {
            type: 'link',
            text: '表单设计',
            size: 'small',
            title: '表单设计',
            order: 1,
            show: compute(({ row }) => {
              return row.isPublish === 0;
            }),
            async click({ row }) {
              const routeUrl = router.resolve({
                path: `/bpm/process/form-design?defId=${row.id}`,
                query: { defId: `${row.id}` },
              });
              await router.push(routeUrl);
            },
          },
          publish: {
            type: 'link',
            text: '发布',
            size: 'small',
            title: '发布',
            order: 5,
            show: compute(({ row }) => {
              return row.isPublish === 0;
            }),
            async click({ row }) {
              await Publish(row.id).then(() => {
                notification.success({ message: '发布成功', duration: 3 });
                crudExpose.doRefresh();
              });
            },
          },
          unPublish: {
            type: 'link',
            text: '取消发布',
            size: 'small',
            title: '发布',
            order: 5,
            show: compute(({ row }) => {
              return row.isPublish !== 0;
            }),
            async click({ row }) {
              await UnPublish(row.id).then(() => {
                notification.success({ message: '取消成功', duration: 3 });
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
        flowCode: {
          title: '编码',
          type: 'text',
          column: { width: 230 },
        },
        flowName: {
          title: '名称',
          type: 'text',
          search: { show: true },
          column: { width: 230 },
        },
        categoryName: {
          title: '分类',
          type: 'text',
          column: { width: 160 },
        },
        isPublish: {
          title: '状态',
          search: { show: true },
          column: { width: 120, show: true, align: 'center' },
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: 9, label: '已失效', color: 'error' },
              { value: 1, label: '已发布', color: 'success' },
              { value: 0, label: '未发布', color: 'warning' },
            ],
          }),
        },
        activityStatus: {
          title: '状态',
          search: { show: true },
          column: { width: 120, show: true, align: 'center' },
          type: 'dict-radio',
          dict: dict({
            data: [
              { value: 1, label: '激活', color: 'success' },
              { value: 0, label: '挂起', color: 'error' },
            ],
          }),
        },
        version: {
          title: '版本',
          type: 'dict-radio',
          column: {
            width: 100,
            show: true,
            align: 'center',
            component: { color: 'auto' },
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
