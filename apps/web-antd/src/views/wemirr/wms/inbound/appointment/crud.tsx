import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery,
  UserPageRes,
  ValueBuilderContext,
} from '@fast-crud/fast-crud';

import { dict } from '@fast-crud/fast-crud';
import { Modal, notification } from 'ant-design-vue';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';
import createCrudOptionsTenant from '#/views/wemirr/wms/basic/warehouse/crud';

import * as api from './api';
import EditableItemSub from './item/index.vue';

export default function crud(
  props: CreateCrudOptionsProps,
): CreateCrudOptionsRet {
  const { crudExpose } = props;
  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery): Promise<UserPageRes> =>
          await api.PageList(query),
        infoRequest: async ({ mode, row }) => {
          if (mode !== 'add') {
            return await api.GetInfo(row.id);
          }
          return row;
        },
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
      },
      toolbar: {},
      search: {},
      actionbar: {
        show: true,
        buttons: {},
      },
      rowHandle: {
        show: true,
        width: 250,
        dropdown: {
          // 操作列折叠
          atLeast: 2,
          more: {
            size: 'small',
            text: '更多',
            // icon: "gg:more-o",
          },
        },
        buttons: {
          distribution: {
            text: '取消预约',
            size: 'small',
            type: 'link',
            order: 4,
            // show: hasPermission("wms:receiving_appointment:cancel"),
            async click({ row }) {
              Modal.confirm({
                iconType: 'info',
                title: '提示',
                content: `您确定要取消预约吗？`,
                onOk: () => {
                  defHttp
                    .put(`/wms/receiving_appointments/${row.id}/status/-10`)
                    .then(() => {
                      notification.success({
                        message: '取消成功',
                        duration: 2,
                      });
                    });
                },
                onCancel: () => {},
              });
            },
          },
          resource: {
            text: '驳回预约',
            type: 'link',
            size: 'small',
            order: 5,
            // show: hasPermission("sys:role:distribution:reject"),
            async click({ row }) {
              Modal.confirm({
                iconType: 'info',
                title: '提示',
                content: `您确定要取消预约吗？`,
                onOk: () => {
                  defHttp
                    .put(`/wms/receiving_appointments/${row.id}/status/-20`)
                    .then(() => {
                      notification.success({
                        message: '取消成功',
                        duration: 2,
                      });
                    });
                },
                onCancel: () => {},
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
        appointmentNo: {
          title: '预约编号',
          type: 'text',
          column: { width: 180 },
          search: { show: true, order: 0 },
          addForm: { show: false },
          editForm: { show: false },
        },
        warehouseId: {
          title: '仓库',
          search: { show: true },
          column: { width: 200, component: { color: 'auto' } },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'name',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/warehouses/ids', values);
            },
          }),
          form: {
            rules: [{ required: true, message: '请选择存储的仓库' }],
            component: {
              crossPage: true,
              valuesFormat: {
                labelFormatter: (item) => {
                  return item.name;
                },
              },
              createCrudOptions: createCrudOptionsTenant,
              crudOptionsOverride: {
                container: {
                  is: 'fs-layout-default',
                },
                rowHandle: { show: false },
                toolbar: { show: false },
                actionbar: { show: false },
                columns: {
                  remark: { column: { show: false } },
                  areaText: { column: { show: false } },
                  area: { column: { show: false } },
                },
              },
            },
          },
        },
        warehouseName: {
          title: '仓库名字',
          type: 'text',
          column: { width: 180 },
          form: { show: false },
        },
        // status: {
        //   title: "仓库名字",
        //   type: "text",
        //   column: { width: 180 },
        //   form: { show: false },
        // },
        inventoryCompanyName: {
          title: '存货公司',
          type: 'text',
          column: { width: 180 },
          search: { show: true },
          form: {
            rules: [{ required: true, message: '存货公司名称不能为空' }],
          },
        },
        contactPerson: {
          title: '联系人',
          type: 'text',
          column: { width: 180 },
          search: { show: false },
          form: {
            rules: [{ required: true, message: '联系人不能为空' }],
          },
        },
        contactPhone: {
          title: '联系方式',
          type: 'text',
          column: { width: 180 },
          search: { show: false },
          form: {
            rules: [{ required: true, message: '联系方式不能为空' }],
          },
        },
        driverName: {
          title: '司机姓名',
          type: 'text',
          column: { width: 180 },
          search: { show: false },
          form: {
            rules: [{ required: true, message: '司机姓名不能为空' }],
          },
        },
        driverMobile: {
          title: '司机电话',
          type: 'text',
          column: { width: 180 },
          search: { show: false },
          form: {
            rules: [{ required: true, message: '司机电话不能为空' }],
          },
        },
        planArrivalTime: {
          title: '预计到达',
          type: 'datetime',
          column: { width: 200 },
          form: {
            component: {
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
            rules: [{ required: true, message: '预计到货时间不能为空' }],
          },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).unix();
            }
          },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
        },
        remark: {
          title: '备注',
          type: 'textarea',
          column: { show: false },
          form: {
            col: {
              span: 24,
            },
          },
        },
        items: {
          title: '子表格',
          type: 'text',
          form: {
            component: {
              name: EditableItemSub,
              vModel: 'modelValue',
            },
            col: {
              span: 24,
            },
            valueResolve({ form }) {
              // 重要，移除$editable_id字段，返回干净的tableData数据
              form.subTable = crudExpose.editable.getTableData(form.subTable);
            },
          },
          column: {
            show: false,
            formatter: ({ row }) => {
              return `${row.subTable?.length}条数据`;
            },
          },
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
        },
      },
      form: {
        wrapper: {
          width: '100%',
        },
      },
    },
  };
}
