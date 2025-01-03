import type {
  AddReq,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  EditReq,
  UserPageQuery,
  UserPageRes,
} from '@fast-crud/fast-crud';

import { compute, dict } from '@fast-crud/fast-crud';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';

// import { downloadToFile } from "@/utils/file/download";
import ReceivingPlanItem from '#/views/wemirr/wms/inbound/receivingPlan/item/index.vue';
// import { useMessage } from "/@/hooks/web/useMessage";
import {
  containerTable,
  dockTable,
  supplierTable,
  warehouseTable,
} from '#/views/wemirr/wms/table-select';

import * as api from './api';

const status = [
  { value: 0, label: '草稿' },
  { value: 10, label: '待执行' },
  { value: 20, label: '执行中' },
  { value: 30, label: '已完成' },
  { value: -10, label: '已取消' },
  { value: -20, label: '关闭' },
];
const arrivalStatus = [
  { value: 'NOT_DELIVERED', label: '未到货' },
  { value: 'DELAY', label: '延迟' },
  { value: 'ARRIVED', label: '已到货' },
];
const receivingPlanType = [
  { value: 'PURCHASE_INVENTORY', label: '采购订单' },
  { value: 'RETURN_INVENTORY', label: '退货入库' },
  { value: 'OUTSOURCING_INVENTORY', label: '委外加工入库' },
  { value: 'REPAIR_INVENTORY', label: '维修入库' },
];
export default function crud({
  crudExpose,
  context,
}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  // const { crudBinding, crudRef } = props.crudExpose;
  // const { notification } = useMessage();
  const receivingItemRef = context.receivingItemRef;

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
          width: '95%',
        },
      },
      rowHandle: {
        width: 250,
        buttons: {
          view: {
            show: compute<boolean>(({ row }) => {
              return row.status != 0;
            }),
          },
          // 导出
          download: {
            type: 'link',
            text: '导出',
            size: 'small',
            title: '导出',
            order: 5,
            async click(context) {
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
          },
          // 提交
          submit: {
            type: 'link',
            text: '确认计划',
            size: 'small',
            title: '确认收货计划',
            order: 0,
            async click(context) {
              api.Submit(context.row.id).then((res) => {
                notification.success({ message: '成功', duration: 3 });
                crudExpose.doRefresh();
              });
            },
            show: compute<boolean>(({ row }) => {
              return row.status === 0;
            }),
          },
          setDock: {
            type: 'link',
            text: '预约月台',
            size: 'small',
            title: '预约月台',
            order: 0,
            async click({ row }) {
              receivingItemRef.value.open({ receivingRow: row });
            },
            show: compute<boolean>(({ row }) => {
              return row.status === 10 && row.dockId === null;
            }),
          },
          setContainer: {
            type: 'link',
            text: '预约容器',
            size: 'small',
            title: '预约容器',
            order: 0,
            async click({ row }) {
              receivingItemRef.value.open({ receivingRow: row });
            },
            show: compute<boolean>(({ row }) => {
              return (
                row.status === 10 &&
                row.containerId === null &&
                row.dockId !== null
              );
            }),
          },
          receiving: {
            type: 'link',
            text: '收货',
            size: 'small',
            title: '收货',
            order: 0,
            async click({ row }) {
              receivingItemRef.value.open({ receivingRow: row });
            },
            show: compute<boolean>(({ row }) => {
              return (
                (row.status === 10 &&
                  row.dockId !== null &&
                  row.containeId !== null) ||
                row.status === 20
              );
            }),
          },
          close: {
            type: 'link',
            text: '关闭',
            size: 'small',
            title: '关闭',
            order: 0,
            async click(context) {
              api.Close(context.row.id).then((res) => {
                notification.success({ message: '成功', duration: 3 });
                crudExpose.doRefresh();
              });
            },
            show: compute<boolean>(({ row }) => {
              return row.status === 20;
            }),
          },
          // 提交
          cancel: {
            type: 'link',
            text: '撤回',
            size: 'small',
            title: '撤回收货计划',
            order: 0,
            async click(context) {
              api.Cancel(context.row.id).then((res) => {
                notification.success({ message: '成功', duration: 3 });
                crudExpose.doRefresh();
              });
            },
            show: compute<boolean>(({ row }) => {
              return row.status === 10;
            }),
          },
          // 编辑
          edit: {
            show: compute<boolean>(({ row }) => {
              return row.status === 0;
            }),
          },
          // 删除
          remove: {
            show: compute(({ row }) => {
              return row.status === 0;
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
          title: '收货计划编号',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160, fixed: 'left' },
          addForm: { show: false },
          editForm: { show: false },
        },
        type: {
          title: '类型',
          type: 'dict-select',
          column: {
            show: true,
            width: 120,
            component: { color: 'auto' },
            fixed: 'left',
          },
          dict: dict({
            data: receivingPlanType,
          }),
          form: {
            rules: [{ required: true, message: '请选择入库计划类型' }],
          },
        },
        receivingNoticeNum: {
          title: '通知单号',
          type: 'text',
          fixed: 'left',
          search: { show: true },
          column: { show: true, width: 160 },
        },
        supplierId: supplierTable(),
        warehouseId: warehouseTable(),
        dockId: dockTable(),
        containerId: containerTable(),
        deliveryDate: {
          title: '发货日期',
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
            rules: [{ required: true, message: '请选择发货日期' }],
          },
        },
        expectedArrivalTime: {
          title: '预计到达',
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
            rules: [{ required: true, message: '请选择预计到货时间' }],
          },
        },
        actualArrivalTime: {
          title: '实际到货',
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
            component: {
              valueFormat: 'YYYY-MM-DD',
            },
            rules: [{ required: true, message: '请选择实际到货时间' }],
          },
        },
        arrivalStatus: {
          title: '到货状态',
          type: 'dict-select',
          column: { show: true, width: 120, component: { color: 'auto' } },
          form: { show: false },
          dict: dict({
            data: arrivalStatus,
          }),
        },
        deliveryCarNumber: {
          title: '送货车牌',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入送货车辆车牌号' }],
          },
        },
        deliveryDriver: {
          title: '送货司机',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入送货司机' }],
          },
        },
        driverContact: {
          title: '司机电话',
          type: 'text',
          search: { show: false },
          column: { show: true, width: 160 },
          form: {
            rules: [{ required: true, message: '请输入司机联系方式' }],
          },
        },
        source: {
          title: '来源',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 160 },
          form: {
            // 表单配置
            rules: [{ required: true, message: '请输入来源' }],
          },
        },
        items: {
          title: '计划明细',
          type: 'text',
          column: { show: false },
          form: {
            component: {
              name: ReceivingPlanItem,
              vModel: 'modelValue',
            },
            col: { span: 24 },
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
