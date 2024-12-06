<script lang="ts" setup name="SysDictPage">
import type { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';

import { h, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Modal } from 'ant-design-vue';

import * as api from './api';
import createFormOptions from './crud';
// import DictItemTable from './item/index.vue';
import { useFs, useUi } from '@fast-crud/fast-crud';

import createCrudOptions from './item/crud';

const { ui } = useUi();
/**
 * 表单对话框独立使用
 * @returns {{formWrapperRef, formWrapperOptions, openFormWrapper: openFormWrapper}}
 */
function useFormWrapperUsingTag(callback) {
  const formWrapperRef = ref();
  const formWrapperOptions = ref();
  formWrapperOptions.value = createFormOptions(callback);

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
const actionList = ref<[]>([]);
const treeRef = ref();
const dictItemTableRef = ref();
// const {hasPermission} = usePermission();
const { formWrapperRef, openFormWrapper, formWrapperOptions } =
  useFormWrapperUsingTag(() => loadDictList());

const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { permission: 'sys:user' },
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
  // dictItemTableRef.value.crudBinding.search.initialForm = {
  //   dictId: nodeRef.id,
  // };
  // crudExpose.crudBinding.addForm.initialForm = {
  //   dictId: nodeRef.id,
  // };
  // crudBinding.actionbar.buttons.add.show = true;
  crudExpose.setSearchFormData({
    form: { dictId: nodeRef.id },
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
    setTimeout(() => {
      actionList.value = [
        {
          render: (node) => {
            return h(EditOutlined, {
              class: 'ml-2',
              onClick: (e) => {
                handleEdit(node);
                e.stopPropagation();
              },
            });
          },
        },
        {
          render: (node) => {
            return h(DeleteOutlined, {
              class: 'ml-2',
              onClick: (e) => {
                handleDelete(node);
                e.stopPropagation();
              },
            });
          },
        },
      ];
    }, 100);
  });
};
</script>

<template>
  <Page content-class="flex gap-2">
    <Card :bordered="false" class="dict-list w-1/3 xl:w-1/4">
      <template #extra>
        <a-button color="success" @click="openFormWrapper"> 新增字典 </a-button>
        <a-button color="success" @click="refreshDictCache">
          刷新缓存
        </a-button>
        <fs-form-wrapper ref="formWrapperRef" v-bind="formWrapperOptions" />
      </template>
      <a-tree
        ref="treeRef"
        :action-list="actionList"
        :checkable="false"
        :click-row-to-expand="false"
        :tree-data="treeData"
        search
        title="系统字典"
        toolbar
        @select="handleSelect"
      />
    </Card>
    <Card class="dict-item w-full" title="字典子项">
      <fs-crud ref="crudRef" v-bind="crudBinding" />
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
