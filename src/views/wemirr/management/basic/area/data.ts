import { FormSchema } from "@/components/Form";

export const schemas: FormSchema[] = [
  {
    field: "parentId",
    component: "Input",
    label: "上级国标码",
    defaultValue: 0,
    componentProps: {
      disabled: true,
      placeholder: "请填写上级国标码",
    },
    required: true,
  },
  {
    field: "id",
    component: "Input",
    label: "国标码",
    componentProps: {
      placeholder: "请填写国标码",
    },
    // dynamicDisabled: ({ values }) => {
    //   return values.id != null;
    // },
    required: true,
  },
  {
    field: "name",
    component: "Input",
    label: "名称",
    componentProps: {
      placeholder: "请输入地址名称",
    },
    required: true,
  },
  {
    field: "level",
    component: "RadioButtonGroup",
    label: "级别",
    defaultValue: 1,
    componentProps: {
      placeholder: "请选择级别",
      options: [
        { label: "省份", value: 1 },
        { label: "城市", value: 2 },
        { label: "区县", value: 3 },
        { label: "乡镇", value: 4 },
      ],
    },
  },
  {
    field: "longitude",
    component: "Input",
    label: "经度",
    componentProps: {
      placeholder: "请填经度",
    },
    itemProps: {
      extra: "请填写正确的经纬度,以便地图定位",
    },
  },
  {
    field: "latitude",
    component: "Input",
    label: "纬度",
    componentProps: {
      placeholder: "请填经度",
    },
    itemProps: {
      extra: "请填写正确的经纬度,以便地图定位",
    },
  },
  {
    field: "sequence",
    component: "InputNumber",
    label: "排序",
    defaultValue: 0,
    componentProps: {
      placeholder: "请填写排序",
      min: 0,
      max: 100,
    },
    itemProps: {
      extra: "数值越小优先级越高",
    },
  },
  {
    field: "source",
    component: "InputTextArea",
    label: "来源",
    componentProps: {
      placeholder: "请填数据来源",
      rows: 3,
    },
    required: false,
  },
];
