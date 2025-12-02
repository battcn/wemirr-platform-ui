<script lang="ts" setup name="UserPageList">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useFs } from '@fast-crud/fast-crud';
import { Card } from 'ant-design-vue';

import DeptTree from '../org/dept-tree.vue';
import createCrudOptions from './crud';

const nodeRef = ref();
const selectDeptId = ref<string[]>([]);
const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { nodeRef, permission: 'sys:user' },
});

onMounted(async () => {
  await crudExpose?.doRefresh();
});

function onTreeSelect() {
  nodeRef.value = {
    id: selectDeptId.value?.[0] ?? null,
  };
  crudExpose.doRefresh();
}
</script>

<template>
  <Page content-class="flex flex-row gap-2" :auto-content-height="true">
    <Card :bordered="false" class="w-1/3 xl:w-1/4">
      <DeptTree v-model:select-dept-id="selectDeptId" @select="onTreeSelect" />
    </Card>
    <Card class="sys-user-page-card w-full" title="用户管理">
      <fs-crud ref="crudRef" v-bind="crudBinding">
        <template #cell_nickName="scope">
          <a-tooltip :title="scope.row.nickName" placement="top">
            {{ scope.row.nickName }}
          </a-tooltip>
        </template>
      </fs-crud>
    </Card>
  </Page>
</template>

<style lang="less" scoped>
:deep(.p-4) {
  padding: 8px !important;
}

:deep(.sys-user-page-card) {
  .fs-crud-container {
    height: calc(100vh - 250px);
  }

  .ant-card-body {
    padding: 8px;
  }
}
</style>
