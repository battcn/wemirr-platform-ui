<script lang="ts" setup name="UserPageList">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useFs } from '@fast-crud/fast-crud';
import { Card } from 'ant-design-vue';

import { getOrgTree } from '#/api/core/org';

import createCrudOptions from './crud';

const treeData = ref();
const nodeRef = ref();
const expandedKeys = ref();
const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { nodeRef, permission: 'sys:user' },
});

onMounted(async () => {
  initOrgList();
  await crudExpose.doRefresh();
});

function initOrgList() {
  getOrgTree({}).then((ret) => {
    treeData.value = ret;
    expandedKeys.value = ret
      .filter((item: any) => item.parentId === '0')
      .map((item: any) => item.id);
  });
}
function handleSelect(checkedKeys: any, event: any) {
  if (!event.selected) {
    return;
  }
  nodeRef.value = event.selectedNodes[0];
  crudExpose.doRefresh();
}
</script>

<template>
  <Page content-class="flex gap-2">
    <Card :bordered="false" class="w-1/3 xl:w-1/4">
      <a-tree
        v-model:expanded-keys="expandedKeys"
        :auto-expand-parent="true"
        :default-expand-all="true"
        :field-names="{ key: 'id', title: 'name' }"
        :show-icon="false"
        :show-line="false"
        :tree-data="treeData"
        @select="handleSelect"
      />
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
/deep/.p-4 {
  padding: 8px !important;
}
/deep/.sys-user-page-card {
  .fs-crud-container {
    min-height: 740px !important;
    max-height: 980px !important;
  }
  .ant-card-body {
    padding: 8px;
  }
}
</style>
