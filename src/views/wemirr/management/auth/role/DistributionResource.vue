<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <RoleList class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <fs-permission-tree
      ref="permissionTreeRef"
      title="角色管理"
      :tree="permissionTreeData"
      :editable="false"
      checkable
      :replace-fields="{ key: 'id', label: 'title' }"
    />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import RoleList from './RoleList.vue';
  import { useGo } from '/@/hooks/web/usePage';
  import FsPermissionTree from '/@/views/wemirr/management/auth/permission/fs-permission-tree.vue';
  import { getMenuList } from '/@/api/sys/menu';

  export default defineComponent({
    name: 'AccountManagement',
    components: { PageWrapper, RoleList, FsPermissionTree },
    setup() {
      const go = useGo();
      const permissionTreeData = ref();
      const searchInfo = reactive<Recordable>({});
      const permissionTreeRef = ref();

      function handleSuccess({ isUpdate, values }) {
        if (isUpdate) {
          // 演示不刷新表格直接更新内部数据。
          // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
          // const result = updateTableDataRecord(values.id, values);
          // console.log(result);
        } else {
          // reload();
        }
      }
      function handleSelect(deptId = '') {
        searchInfo.deptId = deptId;
        // reload();
      }
      function handleView(record: Recordable) {
        go('/system/account_detail/' + record.id);
      }

      onMounted(() => {
        getMenuList().then((ret) => {
          permissionTreeData.value = ret;
        });
      });

      return {
        permissionTreeRef,
        permissionTreeData,
        handleSuccess,
        handleSelect,
        handleView,
        searchInfo,
      };
    },
  });
</script>
