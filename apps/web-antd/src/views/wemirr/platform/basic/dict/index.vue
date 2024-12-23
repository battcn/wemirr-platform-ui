<script lang="ts" setup name="SysDictPage">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useFs, useUi } from '@fast-crud/fast-crud';
import { Card, Modal } from 'ant-design-vue';

import * as api from './api';
import createFormOptions from './dict';
import createCrudOptions from './dict-item-crud';

const { ui } = useUi();

/**
 * 表单对话框独立使用
 * @param {Function} callback - 用于创建表单选项的回调函数
 * @returns {{
 *   formWrapperRef: Ref,          // 表单包装器的引用
 *   openFormWrapper: Function,    // 打开表单的函数
 *   formWrapperOptions: Ref      // 表单选项的引用
 * }} 返回一个对象，包含表单包装器的引用、打开表单的函数和表单选项
 */
function useFormWrapperUsingTag(callback) {
  const formWrapperRef = ref();
  const formWrapperOptions = ref();
  formWrapperOptions.value = createFormOptions(callback);
  formWrapperOptions.value.initialForm = { type: 0 };

  function openFormWrapper() {
    formWrapperRef.value.open(formWrapperOptions.value);
  }

  return {
    formWrapperRef,
    openFormWrapper,
    formWrapperOptions,
  };
}

const treeData = ref();
const treeRef = ref();
const { formWrapperRef, openFormWrapper, formWrapperOptions } =
  useFormWrapperUsingTag(() => loadDictList());

const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { permission: 'dict' },
});

// 页面打开后获取列表数据
onMounted(async () => {
  await loadDictList();
  // await crudExpose.doRefresh();
});

function handleSelect(checkedKeys: any, event: any) {
  if (!event.selected) {
    return;
  }
  const nodeRef = event.selectedNodes[0];
  crudBinding.value.search.initialForm = {
    dictId: nodeRef.id,
    dictCode: nodeRef.code,
  };
  crudBinding.value.addForm.initialForm = {
    dictId: nodeRef.id,
    dictCode: nodeRef.code,
  };
  crudBinding.value.actionbar.buttons.add.show = true;
  crudExpose.setSearchFormData({
    form: { dictId: nodeRef.id, dictCode: nodeRef.code },
  });
  crudExpose.doRefresh();
}

function handleEdit(node: any) {
  formWrapperOptions.value.initialForm = {
    id: node.id,
    code: node.code,
    name: node.name,
    sequence: node.sequence,
    description: node.description,
  };
  formWrapperOptions.value.columns.code.component.disabled = true;
  openFormWrapper();
}

function handleDelete(node: any) {
  Modal.confirm({
    iconType: 'error',
    title: '删除',
    content: `会级联删除子节点以及相关资源数据`,
    onOk: async () => {
      await api.DelObj(node.id).then(() => {
        loadDictList();
        ui.notification.success({
          message: '删除成功',
          duration: 3,
        });
      });
    },
  });
}

const refreshDictCache = () => {
  api.Refresh().then(() => {
    ui.notification.success({
      message: '字典缓存刷新成功',
      duration: 3,
    });
  });
};

const loadDictList = () => {
  api.GetList().then((ret) => {
    treeData.value = ret;
  });
};

const onContextMenuClick = (treeKey: string, menuKey: number | string) => {
  console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);
  if (menuKey === 'delete') {
    api.DelObj(treeKey).then(() => {
      loadDictList();
    });
  }
};
</script>

<template>
  <Page content-class="flex flex-row gap-2">
    <Card :bordered="false" class="dict-list w-1/3 xl:w-1/4">
      <template #extra>
        <a-button
          type="primary"
          v-access:code="'dict:add'"
          @click="openFormWrapper"
        >
          新增字典
        </a-button>
        <span style="margin-left: 10px"></span>
        <a-button
          type="primary"
          v-access:code="'dict:refresh'"
          @click="refreshDictCache"
        >
          刷新缓存
        </a-button>
        <fs-form-wrapper ref="formWrapperRef" v-bind="formWrapperOptions" />
      </template>
      <a-tree
        ref="treeRef"
        :checkable="false"
        :click-row-to-expand="false"
        :tree-data="treeData"
        title="系统字典"
        @select="handleSelect"
      >
        <template #title="{ key: treeKey, title }">
          <a-dropdown :trigger="['contextmenu']">
            <span>{{ title }}</span>
            <template #overlay>
              <a-menu
                @click="
                  ({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)
                "
              >
                <a-menu-item key="modify">修改</a-menu-item>
                <a-menu-item key="delete">删除</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-tree>
    </Card>
    <Card class="dict-item w-full" title="字典子项">
      <fs-crud ref="crudRef" v-bind="crudBinding">
        <template #cell_description="scope">
          <a-tooltip :title="scope.row.description" placement="topLeft">
            {{ scope.row.description }}
          </a-tooltip>
        </template>
        <template #cell_label="scope">
          <a-tooltip :title="scope.row.label" placement="topLeft">
            {{ scope.row.label }}
          </a-tooltip>
        </template>
      </fs-crud>
    </Card>
  </Page>
</template>

<style lang="less" scoped>
/deep/.p-4 {
  padding: 8px !important;
}
/deep/ .dict-list {
  .ant-card-body {
    padding: 10px;
  }
}
/deep/ .dict-item {
  .fs-crud-container {
    min-height: 730px !important;
  }
  .ant-card-body {
    padding: 8px;
  }
}
</style>
