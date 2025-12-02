<script setup lang="ts" name="SysMenuPage">
import type { TreeProps } from 'ant-design-vue';

import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { Card, Modal, notification } from 'ant-design-vue';

import { getAllMenusApi } from '#/api';

import * as api from './api';
import ResourceButtonTable from './button.vue';
import { menuForm } from './scheme';

const actionList = ref<any[]>([]);
const treeData = ref<TreeProps['treeData']>();
const expandedKeys = ref<string[]>();
const itemTableRef = ref();
const [MenuForm, menuFormRef] = menuForm(onSubmit);
const hoveredNodeId = ref<string>('');

function onSubmit(values: Record<string, any>) {
  api.SaveOrUpdate(values).then(() => {
    menuFormRef.resetForm();
    loadMenu();
    notification.success({
      duration: 3,
      message: '提交成功',
    });
    menuFormRef.resetValidate();
  });
}

onMounted(() => {
  loadMenu();
  menuFormRef.setValues({
    type: 'directory',
    parentId: '0',
    component: 'BasicLayout',
  });
  menuFormRef.setState({ showDefaultActions: false });
});

function handlePlus(node: any) {
  menuFormRef.resetValidate();
  itemTableRef.value.crudBinding.actionbar.buttons.add.show = false;
  itemTableRef.value.setParentId('0');
  menuFormRef.resetForm();
  menuFormRef.setValues({
    type: 'menu',
    parentId: node.id,
  });
  itemTableRef.value.setSearchFormData({ form: { parentId: '0' } });
  itemTableRef.value.doRefresh();
  menuFormRef.setState({ showDefaultActions: true });
}

function handleDelete(node: any) {
  Modal.confirm({
    iconType: 'warning',
    title: '确认',
    content: `确定删除 ${node.label} ？ 同时会级联删除子节点以及相关资源数据`,
    onOk: async () => {
      await api.DelObj(node.id).then(() => {
        notification.success({
          message: '删除成功',
          duration: 3,
        });
        loadMenu();
      });
    },
  });
}

async function loadMenu() {
  await getAllMenusApi({}).then((ret) => {
    treeData.value = ret as any;
    expandedKeys.value = ret
      .filter((item: any) => item.parentId === '0')
      .map((item: any) => item.id);
    menuFormRef.resetValidate();
  });
}

function addDirectory() {
  itemTableRef.value.crudBinding.actionbar.buttons.add.show = false;
  itemTableRef.value.setParentId('0');
  menuFormRef.resetForm();
  menuFormRef.setValues({
    type: 'directory',
    parentId: '0',
  });
  menuFormRef.resetValidate();
  itemTableRef.value.setSearchFormData({ form: { parentId: '0' } });
  itemTableRef.value.doRefresh();
  menuFormRef.setState({ showDefaultActions: true });
}

function handleSelect(_: any, event: any) {
  if (!event.selected) {
    return;
  }
  // FIX 调用 resetForm 方法会重新验证表单
  menuFormRef.resetForm();
  menuFormRef.resetValidate();
  menuFormRef.setState({ showDefaultActions: true });
  const selectNode = event.selectedNodes[0];
  const url = selectNode?.url;
  const fields = {
    ...selectNode,
    component: url || selectNode?.component,
  };
  // FIX 字段叫 component 会赋值异常
  menuFormRef.setValues(fields);
  itemTableRef.value.crudBinding.addForm.initialForm = {
    parentId: selectNode.id,
  };
  itemTableRef.value.crudBinding.editForm.initialForm = {
    parentId: selectNode.id,
  };
  itemTableRef.value.crudBinding.actionbar.buttons.add.show =
    selectNode.component !== 'BasicLayout' &&
    selectNode?.children === undefined;
  itemTableRef.value.setSearchFormData({ form: { parentId: selectNode.id } });
  itemTableRef.value.doRefresh();
}

function handleMouseEnter(nodeId: string) {
  hoveredNodeId.value = nodeId;
}

function handleMouseLeave() {
  hoveredNodeId.value = '';
}
</script>

<template>
  <Page content-class="flex gap-2 sys-menu-view">
    <Card class="w-1/3">
      <template #extra>
        <a-button type="primary" @click="addDirectory">新增目录</a-button>
      </template>
      <a-tree
        v-model:expanded-keys="expandedKeys"
        :action-list="actionList"
        :auto-expand-parent="true"
        :default-expand-all="true"
        :field-names="{ key: 'id', title: 'title' }"
        block-node
        :tree-data="treeData"
        @select="handleSelect"
      >
        <template #title="{ title, id }">
          <div
            class="tree-node-title"
            @mouseenter="handleMouseEnter(id)"
            @mouseleave="handleMouseLeave"
          >
            <span>{{ title }}</span>
            <div v-show="hoveredNodeId === id" class="operation-buttons">
              <a-button
                type="link"
                size="small"
                @click.stop="handlePlus({ id, title })"
              >
                <template #icon><PlusOutlined /></template>
              </a-button>
              <a-button
                type="link"
                size="small"
                @click.stop="handleDelete({ id, label: title })"
              >
                <template #icon><DeleteOutlined /></template>
              </a-button>
            </div>
          </div>
        </template>
      </a-tree>
    </Card>
    <Card class="w-1/2" title="菜单信息">
      <MenuForm />
    </Card>
    <Card class="w-1/2">
      <ResourceButtonTable ref="itemTableRef" />
    </Card>
  </Page>
</template>

<style lang="less" scoped>
/deep/ .p-4 {
  padding: 0.5rem;
}

/deep/ .sys-menu-view {
  .ant-card-body {
    padding: 12px;
  }

  .fs-container {
    min-height: 720px;
  }
}

.tree-node-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 8px;

  &:hover {
    background-color: #f5f5f5;
  }

  .operation-buttons {
    display: flex;
    gap: 4px;

    .ant-btn {
      padding: 0 4px;
      color: #1890ff;

      &:hover {
        color: #40a9ff;
      }
    }
  }
}
</style>
