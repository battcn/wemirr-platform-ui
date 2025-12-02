<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, notification } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

import * as api from './api';
import DeptTree from './dept-tree.vue';

const deptTreeRef = ref();
const selectDeptId = ref<string[]>([]);

const [BaseForm, baseFormApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 提交函数
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
      fieldName: 'id',
      component: 'VbenInput',
      label: 'ID',
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
    },
    {
      fieldName: 'parentId',
      component: 'VbenInput',
      label: '上级ID',
      defaultValue: 0,
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
      componentProps: {
        disabled: true,
        placeholder: '请填写上级ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'code',
      component: 'VbenInput',
      label: '编码',
      componentProps: {
        placeholder: '请输入组织编码',
      },
    },
    {
      fieldName: 'label',
      component: 'VbenInput',
      label: '名称',
      componentProps: {
        placeholder: '请输入组织名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'tel',
      component: 'VbenInput',
      label: '联系方式',
      help: '联系方式（130-0217-1000）, 部门座机（0746-8485566）',
      componentProps: {
        placeholder: '请填写联系方式',
      },
      rules: 'required',
    },
    {
      fieldName: 'email',
      component: 'VbenInput',
      label: '邮箱',
      componentProps: {
        placeholder: '请填写邮箱地址',
      },
      rules: 'required',
    },
    {
      fieldName: 'status',
      component: 'RadioGroup',
      label: '状态',
      defaultValue: true,
      componentProps: {
        options: [
          { label: '启用', value: true },
          { label: '禁用', value: false },
        ],
      },
    },
    {
      fieldName: 'sequence',
      component: 'InputNumber',
      label: '排序',
      defaultValue: 0,
      componentProps: {
        placeholder: '请填写排序',
        min: 0,
        max: 100,
      },
      help: '数值越小优先级越高',
    },
    {
      fieldName: 'description',
      component: 'Textarea',
      label: '来源',
      componentProps: {
        placeholder: '请填写描述信息',
        rows: 3,
      },
    },
  ],
});

function onSubmit(values: Record<string, any>) {
  api.save(values).then(() => {
    baseFormApi.resetForm();
    deptTreeRef.value?.loadTree();
    notification.success({ duration: 3, message: '保存成功' });
  });
}

function handleSelect(_: any, event: any) {
  if (!event.selected) {
    return;
  }
  event.selectedNodes[0].name = event.selectedNodes[0].label;
  baseFormApi.setValues({
    ...event.selectedNodes[0],
  });
}
</script>

<template>
  <Page
    content-class="flex flex-row gap-2"
    description="通过组织架构，能够清晰地划分部门职责和个人岗位职责，减少工作重叠和责任不清的情况，提升工作效率。"
    title="机构管理"
  >
    <Card class="w-2/5" title="机构列表">
      <DeptTree
        ref="deptTreeRef"
        v-model:select-dept-id="selectDeptId"
        @select="handleSelect"
      />
    </Card>
    <Card class="w-full" title="详情">
      <BaseForm />
    </Card>
  </Page>
</template>
<style lang="less" scoped>
:deep(.p-4) {
  padding: 8px !important;
}
</style>
