<template>
  <PageWrapper contentClass="flex" contentFullHeight fixedHeight>
    <Card :bordered="false" class="w-1/3 xl:w-1/4">
      <BasicTree
        search
        checkStrictly
        @check="onTreeNodeCheck"
        :clickRowToExpand="false"
        ref="terrRef"
        :treeData="terrData"
        :fieldNames="{ key: 'id', title: 'name' }"
        @select="handleSelect"
      />
    </Card>
    <Card title="用户管理" class="w-full sys-user-page-card">
      <fs-crud ref="crudRef" v-bind="crudBinding">
        <template #cell_nickName="scope">
          <a-tooltip placement="top" :title="scope.row.nickName">
            {{ scope.row.nickName }}
          </a-tooltip>
        </template>
      </fs-crud>
    </Card>
  </PageWrapper>
</template>

<script lang="ts" setup name="UserPageList">
import { ref, onMounted, unref } from "vue";
import createCrudOptions from "./crud";
import { getOrgList } from "@/api/sys/org";
import { useFs } from "@fast-crud/fast-crud";
import { PageWrapper } from "@/components/Page";
import { BasicTree, TreeActionType } from "@/components/Tree";
import { Card } from "ant-design-vue";

const terrRef = ref<Nullable<TreeActionType>>(null);
const terrData = ref();
const nodeRef = ref();

const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { nodeRef, permission: "sys:user" },
});

// 页面打开后获取列表数据
onMounted(() => {
  getOrgList();
  crudExpose.doRefresh();
});

getOrgList().then((ret) => {
  terrData.value = ret;
  setTimeout(() => {
    getTree().filterByLevel(2);
  }, 0);
});
function handleSelect(checkedKeys: any, event: any) {
  if (!event.selected) {
    return;
  }
  nodeRef.value = event.selectedNodes[0];
  crudExpose.doRefresh();
}
function onTreeNodeCheck(keys, event) {
  console.log("keys event", keys, event);
}
function getTree() {
  const tree = unref(terrRef);
  if (!tree) {
    throw new Error("tree is null!");
  }
  return tree;
}
</script>

<style lang="less">
.sys-user-page-card {
  margin-left: 10px;
  .footer {
    .fs-crud-footer {
      padding-bottom: 80px;
    }
  }
  .ant-card-body {
    padding: 0;
  }
  .fs-search-layout-default {
    padding-right: 10px;
  }
}
</style>
