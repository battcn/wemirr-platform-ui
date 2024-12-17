<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { notification, type TreeProps } from 'ant-design-vue';
import { Card } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getOrgTree } from '#/api/core/org';

import * as api from './api';

const expandedKeys = ref();

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
    loadOrgTree();
    notification.success({ duration: 3, message: '保存成功' });
  });
}

onMounted(async () => {
  loadOrgTree();
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

function handlePlus(node: any) {
  // resetFields();
  // setFieldsValue({ parentId: node.id });
}

function handleDelete(node: any) {
  // resetFields();
  // setFieldsValue({ parentId: node.id });
}
const treeData = ref([] as TreeProps);

function loadOrgTree() {
  getOrgTree({}).then((ret: any) => {
    treeData.value = ret;
    expandedKeys.value = ret
      .filter((item: any) => item.parentId === '0')
      .map((item: any) => item.id);
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
      <a-tree
        v-model:expanded-keys="expandedKeys"
        :auto-expand-parent="true"
        :default-expand-all="true"
        :height="620"
        :show-icon="false"
        :show-line="false"
        :tree-data="treeData"
        @select="handleSelect"
      >
        <template #title="node">
          <div class="node-content">
            <span class="node-title">{{ node.name }}</span>
            <div class="node-actions">
              <a-button size="small" type="link" @click="handlePlus(node)">
                <PlusOutlined />
              </a-button>
              <a-button size="small" type="link" @click="handleDelete(node)">
                <DeleteOutlined />
              </a-button>
            </div>
          </div>
        </template>
      </a-tree>
    </Card>
    <Card class="w-full" title="详情">
      <BaseForm />
    </Card>
  </Page>
</template>
<style lang="less" scoped>
/deep/.p-4 {
  padding: 8px !important;
}
.ant-tree-node-content-wrapper .ant-tree-node-content-wrapper-normal {
  flex: auto;
}
.node-content {
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
  padding: 0 8px;
  display: flex;
  position: relative;
  align-items: center;
  width: 100%;
  padding-right: 10px;
}

.node-title {
  font-size: 16px;
  display: inline-flex;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 50px;
}

.node-actions {
  display: flex;
  position: absolute;
  right: 3px;
  position: absolute;
  right: 8px;
  display: none; /* 默认隐藏 */
  gap: 4px;
  align-items: center;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), #fff 25%);
  padding-left: 20px; /* 增加渐变效果的空间 */
}

/* 鼠标悬停时显示按钮 */
.node-content:hover .node-actions {
  display: flex;
}

/* 按钮样式 */
.node-actions .ant-btn {
  padding: 2px;
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-actions .ant-btn:hover {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
}

/* 可选：添加按钮显示/隐藏的过渡动画 */
.node-content {
  transition: padding-right 0.2s ease;
}

.node-content:hover {
  padding-right: 65px; /* 为按钮腾出空间 */
}
</style>
