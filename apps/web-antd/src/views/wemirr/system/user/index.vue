<template>
  <Page content-class="flex gap-2">
    <Card :bordered="false" class="w-1/3 xl:w-1/4">
      <a-tree
          v-model:expandedKeys="expandedKeys"
          :show-line="false"
          :show-icon="false"
          :auto-expand-parent="true"
          :default-expand-all="true"
          :treeData="terrData"
          :fieldNames="{ key: 'id', title: 'name' }"
          @select="handleSelect"
      />
    </Card>
    <Card title="用户管理" class="w-full sys-user-page-card">
      <fs-crud ref="crudRef" v-bind="crudBinding" class="relative right-2 w-[360px] p-0">
        <template #cell_nickName="scope">
          <a-tooltip placement="top" :title="scope.row.nickName">
            {{ scope.row.nickName }}
          </a-tooltip>
        </template>
      </fs-crud>
    </Card>
  </Page>
</template>

<script lang="ts" setup name="UserPageList">
import { ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useFs } from "@fast-crud/fast-crud";
import { Card } from "ant-design-vue";
import {Page} from "@vben/common-ui";
import {defHttp} from "#/api/request";

const terrData = ref();
const nodeRef = ref();
const expandedKeys = ref();
const { crudBinding, crudRef, crudExpose } = useFs({
  createCrudOptions,
  context: { nodeRef, permission: "sys:user" },
});

onMounted(async () => {
  await initOrgList();
  await crudExpose.doRefresh();
});


function initOrgList(){
  defHttp.get("/iam/org/trees?parentId=0").then((ret)=>{
    terrData.value = ret;
    expandedKeys.value = ret.filter((item:any) => item.parentId === '0').map((item:any) => item.id);
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

<style lang="less" scoped>
/deep/.p-4{
  padding: 8px !important;
}
/deep/.sys-user-page-card {
  .fs-crud-container{
    min-height: 740px !important;
    max-height: 980px !important;
  }
  .ant-card-body{
    padding: 8px;
  }
}
</style>
