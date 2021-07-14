<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <BasicTree
      title="资源列表"
      class="fs-permission-tree"
      search
      checkable
      toolbar
      :clickRowToExpand="true"
      :treeData="treeData"
      :replaceFields="{ key: 'id', title: 'name' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';

  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { getMenuList } from '/@/api/sys/menu';

  export default defineComponent({
    name: 'FsPermissionTree',
    components: { BasicTree },
    emits: ['select'],
    setup(_, { emit }) {
      const treeData = ref<TreeItem[]>([]);
      async function fetch() {
        treeData.value = (await getMenuList(true)) as unknown as TreeItem[];
      }
      function handleSelect(keys: string, e) {
        emit('select', keys[0]);
        console.log(keys, e);
      }
      onMounted(() => {
        fetch();
      });
      return { treeData, handleSelect };
    },
  });
</script>

<style lang="less">
  .fs-permission-tree {
    .ant-tree-child-tree {
      .ant-tree-treenode-switcher-open > ul .ant-tree-child-tree-open {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .ant-tree-treenode-switcher-open{
          width: 140px;
          padding-right: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ant-tree-treenode-switcher-close {
          width: 140px;
          padding-right: 10px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
