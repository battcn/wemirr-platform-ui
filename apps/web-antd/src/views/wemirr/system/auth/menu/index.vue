<script setup lang="ts" name="SysMenuPage">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Modal, notification } from 'ant-design-vue';

import { getAllMenusApi } from '#/api';
import { $t } from '#/locales';

import * as api from './api';
import ResourceButtonTable from './button/index.vue';
import { menuForm } from './scheme';

const actionList = ref<any>([]);
const treeData = ref();
const expandedKeys = ref();
const itemTableRef = ref();
const [MenuForm, menuFormRef] = menuForm(onSubmit);
function onSubmit(values: Record<string, any>) {
  api.SaveOrUpdate(values).then(() => {
    menuFormRef.resetForm();
    // loadAreaTree();
    notification.success({
      description: '提交成功',
      duration: 3,
      message: $t('authentication.loginSuccess'),
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
  // resetFields();
  // setFieldsValue({ parentId: node.id });
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

function loadMenu() {
  getAllMenusApi().then((ret) => {
    treeData.value = ret;
    expandedKeys.value = ret
      .filter((item: any) => item.parentId === '0')
      .map((item: any) => item.id);
    menuFormRef.resetValidate();
  });
}

function addDirectory() {
  itemTableRef.value.crudBinding.actionbar.buttons.add.show = false;
  itemTableRef.value.parentId = '0';
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

function handleSelect(checkedKeys: any, event: any) {
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
        :tree-data="treeData"
        @select="handleSelect"
      />
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
</style>
