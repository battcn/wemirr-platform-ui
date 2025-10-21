<script lang="ts" setup name="SysDictPage">
import { onMounted } from 'vue';

import { Page } from '@vben/common-ui';

import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import { FsFormWrapper } from '@fast-crud/fast-crud';
import { Card } from 'ant-design-vue';

import { useDictPage } from './useDict';

const {
  // state
  searchText,
  selectedKeys,
  filteredTree,
  // crud
  crudBinding,
  crudRef,
  // form wrapper
  formWrapperRef,
  openFormWrapper,
  formWrapperOptions,
  // actions
  loadDictList,
  syncDict,
  handleMenuClick,
  handleEdit,
  handleDelete,
} = useDictPage();

onMounted(async () => {
  await loadDictList();
});
</script>

<template>
  <Page class="h-full">
    <div class="flex h-full gap-2">
      <Card :bordered="false" class="flex w-1/3 flex-col">
        <template #extra>
          <a-button
            type="primary"
            v-access:code="'dict:add'"
            @click="openFormWrapper('')"
          >
            新增字典
          </a-button>
          <span style="margin-left: 10px"></span>
          <a-button color="success" @click="syncDict"> 同步字典 </a-button>
          <FsFormWrapper ref="formWrapperRef" v-bind="formWrapperOptions" />
        </template>

        <a-input-search
          v-model:value="searchText"
          placeholder="请输入关键词搜索"
          style="margin-bottom: 16px"
        />
        <div class="dict-scroll-container">
          <a-menu
            v-model:selected-keys="selectedKeys"
            mode="inline"
            style="border: none"
          >
            <!-- 动态生成分类菜单项 -->
            <a-menu-item
              v-for="node in filteredTree"
              :key="node.id"
              class="menu-item-with-actions"
              @click="handleMenuClick(node)"
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
      </Card>
      <Card class="dict-item flex-1" title="字典子项">
        <div style="height: calc(100vh - 280px)">
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
        </div>
      </Card>
    </div>
  </Page>
</template>

<style lang="less" scoped>
/deep/.p-4 {
  padding: 8px !important;
}

/deep/ .dict-item {
  .fs-crud-container {
    height: 100%;
  }
  .ant-card-body {
    padding: 8px;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }
}

/* 固定左侧菜单内部滚动，不影响外层 */
.dict-scroll-container {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 8px;
}

/* 菜单项布局 */
.menu-item-with-actions {
  position: relative;
}
.menu-item-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.menu-actions {
  display: flex;
  margin-left: 28px;
}

/* 优化滚动条样式 */
.dict-scroll-container::-webkit-scrollbar {
  width: 6px;
}
.dict-scroll-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}
.dict-scroll-container::-webkit-scrollbar-track {
  background: transparent;
}
</style>
