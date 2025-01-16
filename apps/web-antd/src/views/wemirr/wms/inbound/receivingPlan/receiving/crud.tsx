import { computed } from 'vue';

import {
  AddReq,
  compute,
  CreateCrudOptionsProps,
  CreateCrudOptionsRet,
  DelReq,
  dict,
  EditReq,
  UserPageQuery,
  UserPageRes,
} from '@fast-crud/fast-crud';
import dayjs from 'dayjs';

import { defHttp } from '#/api/request';
import createMaterialCrudOptions from '#/views/wemirr/wms/metadata/material/crud';

import * as api from './api';

export default function ({
  crudExpose,
  context,
}: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const receivingRef = context.receivingRef;

  const { crudBinding } = crudExpose;
  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
    query.receivingPlanId = receivingRef.value.id;
    return await api.PageList(query);
  };
  const editRequest = async ({ form, row }: EditReq) => {
    if (form.id === null) {
      form.id = row.id;
    }
    return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }: DelReq) => {
    return await api.DelObj(row.id);
  };

  const addRequest = async ({ form }: AddReq) => {
    return await api.AddObj(form);
  };
  const onSelectChange = (keys: any) => {
    context.selectedRowKeys.value = keys;
  };

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest,
      },
      search: { show: true },
      mode: {
        name: 'local',
        isMergeWhenUpdate: true,
        isAppendWhenAdd: true,
      },
      table: {
        rowSelection: {
          selectedRowKeys: context.selectedRowKeys,
          onChange: onSelectChange,
        },
        editable: {
          enabled: true,
          mode: 'free',
          activeDefault: true,
          showAction: true,
          exclusive: false,
          exclusiveEffect: 'save', // "cancel" | "save";
          // 单元格进入编辑模式的激活触发方式,onClick,onDbClick,false, 仅free模式生效
          activeTrigger: 'onClick', // "onClick" | "onDbClick" | false;
          // 通过一个方法判断哪些 cell可以激活编辑
          isEditable: (opts) => {
            return opts.key === 'platQty';
          },
        },
      },
      rowHandle: {
        show: false,
        width: 180,
        align: 'center',
        group: {
          editable: {
            // 自由编辑模式
          },
          editRow: {
            // 行编辑模式
            edit: { size: 'small', type: 'link', text: '收货' },
            save: {
              size: 'small',
              type: 'link',
              // text: "完成收货",
              // async click({ row }) {
              //   console.log("暂未实现", row);
              //   await defHttp.post({
              //     url: `/wms/inbound/receiving-plans/${receivingRef.value.id}/receiving`,
              //     data: [{ itemId: row.id, qty: row.platQty }],
              //   });
              // },
            }, // 保存
            cancel: { size: 'small', type: 'link' }, // 退出编辑
            remove: { show: false },
          },
        },
        buttons: {
          view: { show: false },
          edit: { show: false },
          remove: { show: false },
        },
      },
      columns: {
        receivingPlanId: {
          title: '应收计划ID',
          type: 'text',
          search: { show: false },
          column: { show: false },
          form: {
            value: computed(() => {
              // 动态设置初始值
              return receivingRef.value.id;
            }),
          },
        },
        receivingNoticeNum: {
          title: '应收通知单行号',
          type: 'text',
          form: { show: false },
          column: {
            show: false,
            width: 180,
            // 本字段禁止条件render，因为此字段没有值，是从父组件传过来显示的
            conditionalRender: false,
            cellRender() {
              return receivingRef.value.receivingNoticeNum;
            },
          },
        },
        // warehouseId: {
        //   title: "仓库",
        //   type: "table-select",
        //   form: { show: false },
        //   column: {
        //     //本字段禁止条件render，因为此字段没有值，是从父组件传过来显示的
        //     conditionalRender: false,
        //     component: { color: "auto" },
        //     cellRender() {
        //       return receivingRef.value.warehouseId;
        //     },
        //   },
        //   dict: dict({
        //     value: "id",
        //     label: "warehouseName",
        //     getNodesByValues: async (values: any[]) => {
        //       return await defHttp.post({ url: "/wms/warehouses/ids", data: values });
        //     },
        //   }),
        // },
        // supplierId: {
        //   title: "供应商",
        //   type: "text",
        //   form: { show: false },
        //   column: {
        //     //本字段禁止条件render，因为此字段没有值，是从父组件传过来显示的
        //     conditionalRender: false,
        //     cellRender() {
        //       return receivingRef.value.supplierId;
        //     },
        //   },
        // },
        // deliveryDate: {
        //   title: "发货日期",
        //   type: "datetime",
        //   form: { show: false },
        //   column: {
        //     width: 180,
        //     //本字段禁止条件render，因为此字段没有值，是从父组件传过来显示的
        //     conditionalRender: false,
        //     cellRender() {
        //       return receivingRef.value.deliveryDate;
        //     },
        //   },
        // },
        materialId: {
          title: '物料',
          search: { show: true },
          column: { show: true, width: 200 },
          type: 'table-select',
          dict: dict({
            value: 'id',
            label: 'materialName',
            getNodesByValues: async (values: any[]) => {
              return await defHttp.post('/wms/metadata/materials/ids', values);
            },
          }),
          form: {
            rules: [{ required: true, message: '请选择物料' }],
            show: compute(({ form }) => {
              return form.materialDesc;
            }),
            component: {
              crossPage: true,
              createCrudOptions: createMaterialCrudOptions,
            },
          },
        },
        qty: {
          title: '收货计划数量',
          type: 'number',
          column: {
            show: true,
            width: 140,
            formatter({ value, row, index }) {
              return `${value}(${row.unit})`;
            },
          },
          form: {
            rules: [{ required: true, message: '请输入数量' }],
          },
        },
        completeQty: {
          title: '可收/收货中/收货完成',
          type: 'number',
          column: {
            show: true,
            width: 160,
            formatter({ value, row, index }) {
              return `${row.qty - (row.completeQty + row.progressQty)} / ${
                row.progressQty
              } / ${row.completeQty} (${row.unit})`;
            },
          },
        },
        platQty: {
          title: '本次收货',
          type: 'number',
          column: { show: true, width: 150 },
          form: {
            component: { min: 1, max: 99_999_999 },
            rules: [{ required: true, message: '本次收货数量不能为空' }],
          },
        },
        productionDate: {
          title: '生产日期',
          type: 'date',
          column: { show: true, width: 160 },
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
          form: {
            rules: [{ required: true, message: '请输入生产日期' }],
          },
        },
        expiryDate: {
          title: '失效日期',
          type: 'date',
          column: { show: true, width: 160 },
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
          form: {
            component: { format: 'YYYY-MM-DD' },
            rules: [{ required: true, message: '请输入失效日期' }],
          },
        },
        batchNum: {
          title: '供应商批次号',
          type: 'text',
          search: { show: true },
          column: { show: true, width: 140 },
          form: {
            rules: [{ required: true, message: '请输入批次号' }],
          },
        },
        unitPrice: {
          title: '单位价格(元)',
          type: 'number',
          column: { show: true, width: 140 },
          form: {
            rules: [{ required: true, message: '请输入单位价格' }],
          },
        },
      },
    },
  };
}
