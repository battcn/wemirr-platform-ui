import { FormSchema } from '/@/components/Table';
export const columnJson = {
  Path: [
    {
      field: 'patterns',
      label: '匹配路径',
      component: 'Input',
      componentProps: { placeholder: '请输入匹配路径,多个英文逗号隔开' },
      itemProps: {
        help: '例：/api/**，只要/api开头的都匹配上',
      },
      required: true,
    },
  ] as FormSchema[],
  Host: [
    {
      field: 'patterns',
      label: '匹配host',
      component: 'Input',
      componentProps: { placeholder: '请输入匹配host,多个英文逗号隔开' },
      itemProps: {
        help: '例：**.yuqiyu.com，只要二级域名为yuqiyu.com的都匹配上',
      },
      required: true,
    },
  ] as FormSchema[],
  RemoteAddr: [
    {
      field: 'sources',
      label: '远程地址匹配',
      component: 'Input',
      componentProps: { placeholder: '请输入匹配远程地址匹配,多个英文逗号隔开' },
      itemProps: {
        help: '例：192.168.1.1，只匹配ip为192.168.1.1的请求',
      },
      required: true,
    },
  ] as FormSchema[],
  Cookie: [
    {
      field: 'name',
      label: 'cookie键',
      component: 'Input',
      componentProps: { placeholder: '请输入匹配cookie的键' },
      required: true,
    },
    {
      field: 'regexp',
      label: 'cookie值正则',
      component: 'Input',
      componentProps: { placeholder: '请输入匹配cookie键对应值的正则' },
      required: true,
    },
  ] as FormSchema[],
  Header: [
    {
      field: 'header',
      label: '请求头键',
      component: 'Input',
      componentProps: { placeholder: '请输入匹配请求的键' },
      required: true,
    },
    {
      field: 'regexp',
      label: '请求头值正则',
      component: 'Input',
      componentProps: { placeholder: '请输入匹配请求头键对应值的正则' },
      required: true,
    },
  ] as FormSchema[],
  Method: [
    {
      field: 'methods',
      label: '请求方法匹配',
      component: 'Input',
      componentProps: { placeholder: '请输入请求方法匹配,多个英文逗号隔开' },
      itemProps: {
        help: '常见请求方法：GET、POST、PUT、DELETE',
      },
      required: true,
    },
  ] as FormSchema[],
  Query: [
    {
      field: 'param',
      label: 'query参数键',
      component: 'Input',
      componentProps: { placeholder: '请输入query参数键' },
      required: true,
    },
    {
      field: 'regexp',
      label: 'query参数值正则',
      component: 'Input',
      componentProps: { placeholder: '请输入匹配query参数值正则' },
      required: true,
    },
  ] as FormSchema[],
};
