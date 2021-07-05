<template>
  <div class="bg-white m-4 mr-0 overflow-hidden">
    <BasicTree
      title="资源列表"
      class="fs-permission-tree"
      search
      checkable
      toolbar
      :clickRowToExpand="false"
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
        treeData.value = (await getMenuList()) as unknown as TreeItem[];
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
    width: 1400px;
    ul > .ant-tree-child-tree-open {
      display: flex;
      //flex-wrap: wrap;
    }
  }

  //.ant-tree-child-tree .ant-tree-child-tree-open {
  //  display: flex;
  //  flex-wrap: wrap;
  //}
  //.ant-tree-title {
  //  &:hover {
  //    .node-suffix {
  //      visibility: visible;
  //    }
  //  }
  //}
  //
  //.node-suffix {
  //  visibility: hidden;
  //  > * {
  //    margin-left: 3px;
  //  }
  //}
</style>
