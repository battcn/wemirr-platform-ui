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

import { compute, dict } from '@fast-crud/fast-crud';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';

// import { downloadToFile } from "@/utils/file/download";
import OutboundPlanItem from '#/views/wemirr/wms/outbound/outboundPlan/item/index.vue';
import {
  carrierTable,
  dockTable,
  supplierTable,
  warehouseTable,
} from '#/views/wemirr/wms/table-select';

import * as api from './api';

const status = [
  { value: 10, label: '草稿' },
  { value: 20, label: '配货中' },
  { value: 30, label: '完成' },
  { value: -10, label: '已取消' },
  { value: -20, label: '关闭' },
];
const type = [
  { value: 10, label: '销售出库' },
  { value: 20, label: '调拨出库' },
  { value: 30, label: '退货出库' },
  { value: 40, label: '换货出库' },
  { value: 50, label: '维修出库' },
  { value: 60, label: '销毁出库' },
];
const deliveryMode = [
  { value: 'SELF_PICKUP', label: '自提' },
  { value: 'DELIVERY', label: '送达' },
];
export default function crud({
  crudExpose,
}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  // const { crudBinding, crudRef } = props.crudExpose;
  // const { notification } = useMessage();

  return {
    crudOptions: {
      request: {
        pageRequest: async (query: UserPageQuery): Promise<UserPageRes> =>
          await api.GetList(query),
        addRequest: async ({ form }: AddReq) => await api.AddObj(form),
        editRequest: async ({ form }: EditReq) => await api.UpdateObj(form),
        delRequest: async ({ row }: DelReq) => await api.DelObj(row.id),
        infoRequest: async ({ mode, row }) => {
          if (mode !== 'add') {
            return await api.GetObj(row.id);
          }
          return row;
        },
      },
      toolbar: {},
      actionbar: {
        show: true,
        buttons: {},
      },
      form: {
        wrapper: {
          width: '75%',
        },
      },
      rowHandle: {
        width: 250,
        buttons: {
          view: {
            show: compute<boolean>(({ row }) => {
              return row.status !== 10;
            }),
          },
          // 导出
          download: {
            type: 'link',
            text: '导出',
            size: 'small',
            title: '导出',
            order: 5,
            async click() {
              // await defHttp
              //   .request(
              //     {
              //       url: `/wms/inbound/receiving-plans/${context.row.id}/export`,
              //       method: "POST",
              //       responseType: "blob",
              //     },
              //     { isTransformResponse: false },
              //   )
              //   .then((res) => {
              //     downloadToFile(res, `${context.row.planNum}.pdf`);
              //   });
            },
            show: compute<boolean>(({ row }) => {
              return row.status !== 10;
            }),
          },
          // 提交
          submit: {
            type: 'link',
            text: '确认出库单',
            size: 'small',
            title: '确认出库单',
            order: 0,
            async click(context) {
              api.Submit(context.row.id).then(() => {
                notification.success({ message: '成功', duration: 3 });
                crudExpose.doRefresh();
              });
            },
            show: compute<boolean>(({ row }) => {
              return row.status === 10;
            }),
          },
          confirm: {
            type: 'link',
            text: '确认出库',
            size: 'small',
            title: '确认出库',
            order: 0,
            async click({ row }) {
              api.Confirm(row.id).then(() => {
                notification.success({ message: '成功', duration: 3 });
                crudExpose.doRefresh();
              });
            },
            show: compute<boolean>(({ row }) => {
              return row.status === 20;
            }),
          },
          close: {
            type: 'link',
            text: '关闭',
            size: 'small',
            title: '关闭',
            order: 0,
            async click(context) {
              api.Close(context.row.id).then(() => {
                notification.success({ message: '成功', duration: 3 });
                crudExpose.doRefresh();
              });
            },
            show: compute<boolean>(({ row }) => {
              return row.status === 20;
            }),
          },
          cancel: {
            type: 'link',
            text: '撤回',
            size: 'small',
            title: '撤回',
            order: 0,
            async click(context) {
              api.Cancel(context.row.id).then(() => {
                notification.success({ message: '成功', duration: 3 });
                crudExpose.doRefresh();
              });
            },
            show: compute<boolean>(({ row }) => {
              return row.status === 20;
            }),
          },
          // 编辑
          edit: {
            show: compute<boolean>(({ row }) => {
              return row.status === 10;
            }),
          },
          // 删除
          remove: {
            show: compute(({ row }) => {
              return row.status === 10;
            }),
          },
        },
      },
      tabs: {
        name: 'status',
        show: true,
        type: 'line',
      },
      columns: {
        id: {
          title: 'ID',
          type: 'text',
          form: { show: false },
          column: { show: false },
        },
        planNum: {
          title: '出库单编号',
          type: 'text',
          search: { show: true },
          // form: { component: { disabled: true } },
          column: { show: true, width: 160, fixed: 'left' },
        },
        type: {
          title: '出库单类型',
          type: 'dict-select',
          search: { show: false },
          column: { show: true, width: 160, fixed: 'left' },
          form: {
            rules: [{ required: true, message: '请选择出库单类型' }],
          },
          dict: dict({
            data: type,
          }),
        },
        supplierId: supplierTable(),
        carrierId: carrierTable(),
        warehouseId: warehouseTable(),
        dockId: dockTable(),
        deliveryDate: {
          title: '计划发货日期',
          type: 'date',
          search: { show: false },
          column: { show: true, width: 160 },
          valueBuilder({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value);
            }
          },
          valueResolve({ value, row, key }: ValueBuilderContext): void {
            if (value !== null) {
              row[key] = dayjs(value).format('YYYY-MM-DD');
            }
          },
          form: {
            component: { valueFormat: 'YYYY-MM-DD' },
            rules: [{ required: true, message: '请选择计划发货日期' }],
          },
        },
        deliveryCarNumber: {
          title: '运单号或车辆车牌号',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入送货车辆车牌号' }],
          },
        },
        deliveryDriver: {
          title: '运输人(司机)',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入送货司机' }],
          },
        },
        driverContact: {
          title: '司机联系方式',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入司机联系方式' }],
          },
        },
        customerOrderNum: {
          title: '客户订单号',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
        },
        deliveryReceiver: {
          title: '收货人',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入收货人' }],
          },
        },
        deliveryReceiverPhone: {
          title: '收货人电话',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入收货人电话' }],
          },
        },
        deliveryReceiverAddress: {
          title: '收货人地址',
          type: ['textarea'],
          column: { ellipsis: true, show: false },
          form: {
            col: { span: 24 },
          },
        },
        deliveryMode: {
          title: '送货方式',
          type: 'dict-select',
          column: { show: true, width: 100, component: { color: 'auto' } },
          dict: dict({
            data: deliveryMode,
          }),
        },
        remark: {
          title: '备注',
          type: 'textarea',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            col: { span: 24 },
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
        items: {
          title: '计划明细',
          type: 'text',
          column: { show: false },
          form: {
            component: {
              name: OutboundPlanItem,
              vModel: 'modelValue',
            },
            col: {
              span: 24,
            },
            valueResolve({ form }) {
              // 重要，移除$editable_id字段，返回干净的tableData数据
              form.items = crudExpose.editable.getTableData(form.items);
            },
          },
        },
        status: {
          title: '状态',
          type: 'dict-select',
          column: {
            show: true,
            width: 75,
            component: { color: 'auto' },
            fixed: 'right',
          },
          form: { show: false },
          dict: dict({
            data: status,
          }),
        },
      },
    },
  };
}
