<template>
  <a-row class="row-res">
    <a-col :span="7" class="bg-white m-4 mr-0 overflow-hidden">
      <BasicTree
        title="角色列表"
        search
        :clickRowToExpand="false"
        :treeData="roleListData"
        :replaceFields="{ key: 'id', title: 'name' }"
        @select="handleCheck"
      />
    </a-col>
    <a-col :span="16" class="bg-white m-4 mr-0 overflow-hidden">
      <BasicTree
        title="资源列表(暂时没好的显示方案)"
        ref="permissionTreeRef"
        class="fs-permission-tree"
        defaultExpandLevel="1"
        search
        checkable
        toolbar
        :clickRowToExpand="false"
        :treeData="permissionTreeData"
        :replaceFields="{ key: 'id', title: 'name' }"
        @select="handleSelect"
      />
    </a-col>
  </a-row>
</template>
<script lang="ts">
  import { defineComponent, ref, unref, reactive, onMounted } from 'vue';
  import { getMenuList } from '/@/api/sys/menu';
  import { BasicTree } from '/@/components/Tree';
  import { getAllRoleList } from '/@/api/sys/org';

  export default defineComponent({
    name: 'AccountManagement',
    components: { BasicTree },
    setup() {
      const searchInfo = reactive<Recordable>({});
      const permissionTreeRef = ref();
      const roleListData = ref();
      const permissionTreeData = ref();

      // function getTree() {
      //   const tree = unref(permissionTreeRef);
      //   if (!tree) {
      //     throw new Error('tree is null!');
      //   }
      //   return tree;
      // }
      onMounted(() => {
        getMenuList(true).then((ret) => {
          permissionTreeData.value = ret;
        });
        getAllRoleList().then((ret) => {
          roleListData.value = ret;
        });
        // getTree().expandAll(true);
      });

      function handleCheck(checkedKeys, e) {
        getMenuList(true).then((ret) => {
          permissionTreeData.value = ret;
        });
        console.log('onChecked', checkedKeys, e);
      }

      function handleSelect(...context) {
        console.log('content', context);
      }
      return {
        roleListData,
        permissionTreeRef,
        permissionTreeData,
        handleSelect,
        handleCheck,
        searchInfo,
      };
    },
  });
</script>

<style lang="less">
  .row-res {
    height: 100%;
    width: 100%;
  }
  .fs-permission-tree {
    .ant-tree-child-tree {
      ul .ant-tree-child-tree-open {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        .ant-tree-treenode-switcher-close {
          width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ant-tree-treenode-switcher-open {
          width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
