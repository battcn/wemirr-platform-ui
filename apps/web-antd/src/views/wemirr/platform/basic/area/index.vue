<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { notification, type TreeProps } from 'ant-design-vue';
import { Card } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getAreaTree } from '#/api';
import { defHttp } from '#/api/request';
import { $t } from '#/locales';

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
      fieldName: 'parentId',
      component: 'Input',
      label: '上级国标码',
      defaultValue: 0,
      componentProps: {
        disabled: true,
        placeholder: '请输入上级国标码',
      },
      rules: 'required',
    },
    {
      fieldName: 'id',
      component: 'Input',
      label: '国标码',
      componentProps: {
        placeholder: '请输入国标码',
      },
      rules: 'required',
    },
    {
      fieldName: 'name',
      component: 'Input',
      label: '地址名称',
      componentProps: {
        placeholder: '请输入地址名称',
      },
      rules: 'required',
    },
    {
      fieldName: 'level',
      component: 'RadioGroup',
      label: '级别',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '省份', value: 1 },
          { label: '城市', value: 2 },
          { label: '区县', value: 3 },
          { label: '乡镇', value: 4 },
        ],
      },
    },
    {
      fieldName: 'longitude',
      component: 'Input',
      label: '经度',
      componentProps: {
        placeholder: '请填经度',
      },
      help: '请填写正确的经纬度,以便地图定位',
    },
    {
      fieldName: 'latitude',
      component: 'Input',
      label: '纬度',
      componentProps: {
        placeholder: '请填经度',
      },
      help: '请填写正确的经纬度,以便地图定位',
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
      fieldName: 'source',
      component: 'Textarea',
      label: '来源',
      componentProps: {
        placeholder: '请输入数据来源',
        rows: 3,
      },
      rules: 'required',
    },
  ],
});

function onSubmit(values: Record<string, any>) {
  defHttp.post('/iam/areas', values).then(() => {
    baseFormApi.resetForm();
    loadAreaTree();
    notification.success({
      description: '提交成功',
      duration: 3,
      message: $t('authentication.loginSuccess'),
    });
  });
}

onMounted(async () => {
  await loadAreaTree();
});

function handleSelect(checkedKeys: any, event: any) {
  if (!event.selected) {
    return;
  }
  event.selectedNodes[0].name = event.selectedNodes[0].label;
  baseFormApi.setValues({
    ...event.selectedNodes[0],
  });
}

const treeData = ref([] as TreeProps);

function loadAreaTree() {
  getAreaTree().then((ret: any) => {
    treeData.value = ret;
  });
}
</script>

<template>
  <Page
    content-class="flex flex-row gap-2"
    description="地区数据关系到地址库后续提供的应用能力,请勿随意篡改数据。"
    title="地区信息"
  >
    <Card class="w-2/5">
      <template #extra>
        <a-tooltip
          placement="right"
          title="鉴于地址变动频率较低,切不易维护,故禁用,有需求的请 Fork 代码放开限制即可"
        />
      </template>
      <a-tree
        :field-names="{ children: 'children', title: 'name', key: 'value' }"
        :height="620"
        :tree-data="treeData"
        @select="handleSelect"
      />
    </Card>
    <Card class="w-full" title="地址信息">
      <BaseForm />
    </Card>
  </Page>
</template>
<style lang="less" scoped>
/deep/.p-4 {
  padding: 8px !important;
}
</style>
