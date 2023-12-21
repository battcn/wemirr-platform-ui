<template>
  <PageWrapper contentClass="flex" contentFullHeight fixedHeight>
    <Card :bordered="false" class="w-1/3 xl:w-1/4">
      <BasicTree
        search
        checkStrictly
        @check="onTreeNodeCheck"
        :clickRowToExpand="false"
        ref="terrDataRef"
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

<script>
import { defineComponent, ref, onMounted, unref } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
import { BasicTree } from "@/components/Tree";
import { Card } from "ant-design-vue";
import { PageWrapper } from "@/components/Page";
import { getOrgList } from "@/api/sys/org";

export default defineComponent({
  name: "UserPageList",
  components: { PageWrapper, Card, BasicTree },
  setup() {
    const terrDataRef = ref({});
    const terrData = ref();
    const nodeRef = ref();

    const crudRef = ref();
    const crudBinding = ref();
    const { expose } = useExpose({ crudRef, crudBinding });
    const { crudOptions } = createCrudOptions({ expose, nodeRef });
    useCrud({ expose, crudOptions, permission: "sys:user" });

    // 页面打开后获取列表数据
    onMounted(() => {
      getOrgList();
      expose.doRefresh();
    });

    getOrgList().then((ret) => {
      terrData.value = ret;
      setTimeout(() => {
        getTree().filterByLevel(2);
      }, 0);
    });
    function handleSelect(checkedKeys, event) {
      if (!event.selected) {
        return;
      }
      nodeRef.value = event.selectedNodes[0];
      expose.doRefresh();
    }
    function onTreeNodeCheck(keys, event) {
      console.log("keys event", keys, event);
    }
    function getTree() {
      const tree = unref(terrDataRef);
      if (!tree) {
        throw new Error("tree is null!");
      }
      return tree;
    }

    return {
      terrDataRef,
      terrData,
      crudBinding,
      crudRef,
      handleSelect,
      onTreeNodeCheck,
    };
  },
});
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
    padding: 10px !important;
  }
  .fs-search-layout-default {
    padding-right: 20px;
  }
}
</style>
