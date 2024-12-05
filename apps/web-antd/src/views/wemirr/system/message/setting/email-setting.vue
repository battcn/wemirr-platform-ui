<script lang="ts" setup name="EmailSetting">
import { onMounted } from 'vue';

import { notification } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { defHttp } from '#/api/request';
import { $t } from '#/locales';

const [BaseForm, baseFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'status',
      component: 'RadioGroup',
      label: '状态',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
      },
    },
    {
      fieldName: 'host',
      component: 'Textarea',
      label: '主机地址',
      componentProps: {
        placeholder: '请输入邮件发送主机地址',
        rows: 2,
      },
      rules: 'required',
    },
    {
      fieldName: 'port',
      component: 'Input',
      label: '服务端口',
      componentProps: {
        placeholder: '请输入邮件发送服务端口号',
      },
      rules: 'required',
    },
    {
      fieldName: 'protocol',
      component: 'Input',
      label: '服务协议',
      componentProps: {
        placeholder: '请输入邮件发送服务协议',
      },
      rules: 'required',
    },
    {
      fieldName: 'username',
      component: 'Input',
      label: '邮箱账户',
      componentProps: {
        placeholder: '请输入邮箱发送者用户名或者账户',
      },
      rules: 'required',
    },
    {
      fieldName: 'password',
      component: 'Input',
      label: '密码/授权码',
      componentProps: {
        placeholder: '请输入邮件发送者密码或者授权码',
      },
      rules: 'required',
    },
    {
      fieldName: 'encoding',
      component: 'Input',
      label: '默认编码',
      // defaultValue: 'UTF-8',
      componentProps: {
        placeholder: '请输入邮件默认编码',
      },
      rules: 'required',
    },
    {
      fieldName: 'smtp.auth',
      component: 'RadioGroup',
      label: '开启 Auth',
      defaultValue: true,
      componentProps: {
        componentProps: {
          options: [
            { label: '开启', value: true },
            { label: '关闭', value: false },
          ],
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'smtp.ssl',
      component: 'RadioGroup',
      label: '开启 SSL',
      defaultValue: true,
      componentProps: {
        componentProps: {
          options: [
            { label: '开启', value: true },
            { label: '关闭', value: false },
          ],
        },
      },
      rules: 'required',
    },
    {
      fieldName: 'description',
      component: 'Textarea',
      label: '描述',
      componentProps: {
        placeholder: '请输入配置描述信息',
        rows: 3,
      },
      rules: 'required',
    },
  ],
});

function onSubmit(values: Record<string, any>) {
  defHttp.post('/iam/message-channel/setting', values).then(() => {
    baseFormApi.resetForm();
    notification.success({
      description: '提交成功',
      duration: 3,
      message: $t('authentication.loginSuccess'),
    });
  });
}

onMounted(async () => {});
</script>
<template>
  <BaseForm />
</template>
