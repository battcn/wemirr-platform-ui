<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DeptTree from './DeptTree.vue';
  import { useGo } from '/@/hooks/web/usePage';
  export default defineComponent({
    name: 'AccountManagement',
    components: { PageWrapper, DeptTree },
    setup() {
      const go = useGo();
      // const [registerModal, { openModal }] = useModal();
      const searchInfo = reactive<Recordable>({});
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
      return {
        // registerTable,
        // registerModal,
        handleSuccess,
        handleSelect,
        handleView,
        searchInfo,
      };
    },
  });
</script>
