<template>
  <a-tree
    v-model:expanded-keys="expandedKeys"
    :action-list="actionList"
    :auto-expand-parent="true"
    :default-expand-all="true"
    block-node
    :tree-data="treeData"
    @select="handleSelect"
  >
    <template #title="{ id, label }">
      <div
        class="flex items-center justify-between w-full"
        @mouseenter="handleMouseEnter(id)"
        @mouseleave="handleMouseLeave"
      >
        <span>{{ label }}</span>
        <div v-show="hoveredNodeId === id" class="flex gap-2">
          <EditOutlined class="cursor-pointer text-blue-500" @click.stop="handlePlus({ id })" />
          <DeleteOutlined class="cursor-pointer text-red-500" @click.stop="handleDelete({ id, label })" />
        </div>
      </div>
    </template>
  </a-tree>
</template>

<script setup>
import { ref } from 'vue';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons-vue';

const hoveredNodeId = ref<string>('');

function handleMouseEnter(nodeId: string) {
  hoveredNodeId.value = nodeId;
}

function handleMouseLeave() {
  hoveredNodeId.value = '';
}
</script>

<style lang="less" scoped>
.sys-menu-view {
  .ant-tree-node-content-wrapper {
    flex: 1;
    width: 100%;
  }
}
</style> 