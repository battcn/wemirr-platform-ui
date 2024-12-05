<script lang="ts" setup name="BaseSetting">
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
      fieldName: 'title',
      component: 'Input',
      label: '标题',
      componentProps: {
        placeholder: '请输入消息渠道标题',
      },
      rules: 'required',
    },
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

<style lang="less" scoped></style>
