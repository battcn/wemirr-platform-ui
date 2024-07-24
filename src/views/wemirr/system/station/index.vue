<template>
  <PageWrapper contentClass="flex" contentFullHeight fixedHeight>
    <Card :bordered="false" class="w-1/3 xl:w-1/4">
      <BasicTree
        search
        checkStrictly
        @check="onTreeNodeCheck"
        :clickRowToExpand="false"
        ref="treeRef"
        :treeData="terrData"
        :fieldNames="{ key: 'id', title: 'name' }"
        @select="handleSelect"
      />
    </Card>
    <Card title="岗位管理" class="w-full sys-station-page-card">
      <fs-crud ref="crudRef" v-bind="crudBinding" />
    </Card>
  </PageWrapper>
</template>

<script lang="ts" setup name="StationForm">
import { ref, onMounted, unref } from "vue";
import createCrudOptions from "./crud";
import { useFs } from "@fast-crud/fast-crud";
import { BasicTree, TreeActionType } from "@/components/Tree";
import { PageWrapper } from "@/components/Page";
import { getOrgList } from "@/api/sys/org";
import { Card } from "ant-design-vue";

const treeRef = ref<Nullable<TreeActionType>>(null);
const terrData = ref();
const nodeRef = ref();
const { crudRef, crudBinding, crudExpose } = useFs({
  createCrudOptions,
  context: { nodeRef, permission: "sys:station" },
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
  const tree = unref(treeRef);
  if (!tree) {
    throw new Error("tree is null!");
  }
  return tree;
}
</script>
<style lang="less" scoped>
/deep/ .sys-station-page-card {
  margin-left: 10px;

  .footer {
    .fs-crud-footer {
      padding-bottom: 80px;
    }
  }

  .ant-card-body {
    padding: 10px !important;
  }
}
</style>
