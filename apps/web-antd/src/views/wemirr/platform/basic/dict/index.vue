<script lang="ts" setup name="SysDictPage">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import { FsFormWrapper, useFs, useUi } from '@fast-crud/fast-crud';
import { Card, Modal } from 'ant-design-vue';

import * as api from './api';
import createFormOptions from './dict';
import createCrudOptions from './dict-item-crud';

const { ui } = useUi();

function useFormWrapperUsingTag(callback: any) {
  const formWrapperRef = ref();
  const formWrapperOptions = ref();
  formWrapperOptions.value = createFormOptions(callback);
  const initData = {
    type: 0,
    sequence: 99,
    dictId: undefined,
    dictCode: undefined,
  };
  function openFormWrapper(form: any) {
    formWrapperOptions.value.initialForm = form || initData;
    formWrapperOptions.value.columns.code.component.disabled = false;
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

const loadDictList = () => {
  api.GetList().then((ret) => {
    treeData.value = ret;
  });
};
const { formWrapperRef, openFormWrapper, formWrapperOptions } =
  useFormWrapperUsingTag(() => loadDictList());

const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { permission: 'dict' },
});

// 页面打开后获取列表数据
onMounted(async () => {
  loadDictList();
});

function handleSelect(checkedKeys: any, event: any) {
  if (!event.selected) {
    return;
  }
  const nodeRef = event.selectedNodes[0];
  const crudBindRef = crudBinding.value as any;
  const initialForm = { parentId: nodeRef.id, parentCode: nodeRef.code };
  crudBindRef.search.initialForm = initialForm;
  crudBindRef.addForm.initialForm = initialForm;
  crudBindRef.actionbar.buttons.add.show = true;
  crudExpose.setSearchFormData({ form: { ...initialForm } });
  crudExpose.doRefresh();
}

const handleEdit = (node: any) => {
  const initForm = {
    id: node.id,
    code: node.code,
    type: node.type,
    name: node.name,
    sequence: node.sequence,
    description: node.description,
  };
  formWrapperOptions.value.columns.code.component.disabled = true;
  openFormWrapper(initForm);
};

const handleDelete = (node: any) => {
  Modal.confirm({
    iconType: 'error',
    title: '删除',
    content: `会级联删除子节点以及相关资源数据`,
    onOk: async () => {
      await api.DelObj(node.id).then(() => {
        loadDictList();
        ui.notification.success({
          message: '删除成功',
        });
      });
    },
  });
};

const refreshDictCache = () => {
  api.Refresh().then(() => {
    ui.notification.success({
      message: '字典缓存刷新成功',
    });
  });
};

const searchText = ref('');
const selectedKeys = ref(['all']);

const hoveredKey = ref('');

// 菜单项鼠标进入事件
const handleMenuMouseEnter = (key) => {
  hoveredKey.value = key;
};

// 菜单项鼠标离开事件
const handleMenuMouseLeave = () => {
  hoveredKey.value = '';
};
// 菜单点击事件
const handleMenuClick = ({ key }) => {
  selectedKeys.value = [key];
};

// 搜索事件
const handleSearch = () => {
  // 搜索逻辑已经在computed属性中处理
};
</script>

<template>
  <Page content-class="flex flex-row gap-2">
    <Card :bordered="false" class="dict-list w-1/3 xl:w-1/4">
      <template #extra>
        <a-button
          type="primary"
          v-access:code="'dict:add'"
          @click="openFormWrapper('')"
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
        <FsFormWrapper ref="formWrapperRef" v-bind="formWrapperOptions" />
      </template>

      <div class="">
        <div class="">
          <a-input-search
            v-model:value="searchText"
            placeholder="请输入关键词搜索"
            style="margin-bottom: 16px"
            @search="handleSearch"
          />
          <div class="scrollable-menu-container">
            <a-menu
              v-model:selected-keys="selectedKeys"
              mode="inline"
              style="border: none"
              @click="handleMenuClick"
            >
              <!-- 动态生成分类菜单项 -->
              <a-menu-item
                v-for="node in treeData"
                :key="node.id"
                class="menu-item-with-actions"
                @mouseenter="handleMenuMouseEnter(node)"
                @mouseleave="handleMenuMouseLeave"
              >
                <div class="menu-item-content">
                  <span>{{ node.name }}</span>
                  <div class="menu-actions">
                    <a-button
                      type="text"
                      size="small"
                      @click.stop="handleEdit(node)"
                    >
                      <template #icon><EditOutlined /></template>
                    </a-button>
                    <a-button
                      type="text"
                      size="small"
                      danger
                      @click.stop="handleDelete(node)"
                    >
                      <template #icon><DeleteOutlined /></template>
                    </a-button>
                  </div>
                </div>
              </a-menu-item>
            </a-menu>
          </div>
        </div>

        <!--      <a-tree
        ref="treeRef"
        :checkable="false"
        :click-row-to-expand="false"
        :tree-data="treeData"
        block-node
        title="系统字典"
        @select="handleSelect"
      >
        <template #title="node">
          <span>{{ node.name }}</span>
          <div style="float: right">
            <FsButton
              size="small"
              type="link"
              v-access:code="'dict:edit'"
              @click="handleEdit(node)"
            >
              编辑
            </FsButton>
            <FsButton
              size="small"
              type="link"
              v-access:code="'dict:remove'"
              @click="handleDelete(node)"
            >
              删除
            </FsButton>
          </div>
        </template>
      </a-tree>-->

        <!--      <a-tree
        ref="treeRef"
        :checkable="false"
        :click-row-to-expand="false"
        :tree-data="treeData"
        block-node
        title="系统字典"
        @select="handleSelect"
        class="dict-tree"
      >
        <template #title="node">
          <a-row :gutter="8" align="middle">
            <a-col flex="1"> {{ node.name }} </a-col>
            <a-col class="lh-1">
              <a-dropdown :trigger="['click']" @click.stop>
                <a-button size="small" type="text">
                  <template #icon>
                    <MoreOutlined />
                  </template>
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item> 编辑 </a-menu-item>
                    <a-menu-item @click="handleDelete">删除</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-col>
          </a-row>
        </template>
      </a-tree>-->
      </div>
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
  min-width: 300px;

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

.menu-item-with-actions {
  position: relative;
}

.menu-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* 添加滚动容器样式 */
.scrollable-menu-container {
  height: 600px;
  overflow-y: auto;
  border-right: 0 solid #f0f0f0;
}

.menu-actions {
  display: flex;
  margin-left: 28px;
}

/* 操作按钮样式 */
.operation-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
</style>
