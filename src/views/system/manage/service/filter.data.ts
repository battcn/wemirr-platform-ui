import { FormSchema } from '/@/components/Table';
export const columnJson = {
  RewritePath: [
    {
      field: 'regexp',
      label: '重写前',
      component: 'Input',
      itemProps: {
        help: "例：/api/(?<segment>.*)中，(?<segment>.*)：正则'?.*'，<segment>：截取内容",
      },
      componentProps: { placeholder: '请输入重写前正则' },
      required: true,
    },
    {
      field: 'replacement',
      label: '重写后',
      component: 'Input',
      componentProps: { placeholder: '请输入重写后地址或待表达式的地址' },
      required: true,
      itemProps: {
        help: "例如：/${segment}中，${segment}：重写前正则截取内容'<segment>'",
      },
    },
  ] as FormSchema[],
  StripPrefix: [
    {
      field: 'StripPrefix',
      label: '前缀剥离',
      component: 'InputNumber',
      itemProps: {
        help: '例：需要在/api/system中剥离/api,则输入比例数1',
      },
      componentProps: { placeholder: '请输入剥离数' },
      required: true,
    },
  ] as FormSchema[],
  PrefixPath: [
    {
      field: 'PrefixPath',
      label: '前缀追加',
      component: 'Input',
      itemProps: {
        help: '例：需要在/system中追加/api,则输入/api',
      },
      componentProps: { placeholder: '请输入需要追加的前缀字符串' },
      required: true,
    },
  ] as FormSchema[],
};
