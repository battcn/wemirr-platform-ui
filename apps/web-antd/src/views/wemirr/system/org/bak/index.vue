<template>
  <PageWrapper contentClass="flex">
    <Card :bordered="false">
      <template #extra>
<!--        <a-button @click="handlePlus" v-if="hasPermission('sys:org:add')">新增根节点</a-button>-->
      </template>
      <BasicTree
        title="组织列表"
        search
        treeWrapperClassName="h-[calc(100%-35px)] overflow-auto"
        checkStrictly
        ref="treeRef"
        :clickRowToExpand="false"
        :treeData="treeData"
        :fieldNames="{ key: 'id', title: 'name' }"
        @select="handleSelect"
        :actionList="actionList"
      />
    </Card>
    <Card title="组织管理" style="margin-left: 10px">
<!--      <BasicForm @register="register" />-->
    </Card>
  </PageWrapper>
</template>

<script lang="ts" setup name="OrgForm">
import { onMounted, ref, h } from "vue";
// import { BasicForm, useForm } from "@/components/Form";
// import { BasicTree, TreeActionItem, TreeActionType } from "@/components/Tree/index";
// import { PageWrapper } from "@/components/Page";
import {Card, Modal, notification} from "ant-design-vue";
// import { getOrgList } from "@/api/sys/org";
// import { useMessage } from "@/hooks/web/useMessage";
import { schemas } from "./data";
import * as api from "./api";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import {orgTrees} from "#/api/core/org";
// import { usePermission } from "@/hooks/web/usePermission";

// const { hasPermission } = usePermission();
// const { notification, createConfirm } = useMessage();
const actionList = ref<any[]>([]);
// const treeRef = ref<Nullable<TreeActionType>>(null);
const treeData = ref();

onMounted(() => {
  loadOrgList();
});

function handlePlus(node: any) {
  // resetFields();
  // setFieldsValue({ parentId: node.id ?? "0" });
}

function handleDelete(node) {
  Modal.confirm({
    iconType: "warning",
    title: "确认",
    content: `确定删除 ${node.label} ？ 同时会级联删除子节点以及相关资源数据`,
    onOk: async () => {
      await api.DelObj(node.id).then(() => {
        notification.success({
          message: "删除成功",
          duration: 3,
        });
        loadOrgList();
      });
    },
  });
}

function loadOrgList() {
  orgTrees().then((ret) => {
    treeData.value = ret;
    setTimeout(() => {
      actionList.value = [
        {
          // show: hasPermission("sys:org:add"),
          render: (node) => {
            return h(PlusOutlined, {
              class: "ml-2",
              onClick: (e) => {
                handlePlus(node);
                e.stopPropagation();
              },
            });
          },
        },
        {
          // show: hasPermission("sys:org:remove"),
          render: (node) => {
            return h(DeleteOutlined, {
              class: "ml-2",
              onClick: (e) => {
                handleDelete(node);
                e.stopPropagation();
              },
            });
          },
        },
      ];
    }, 0);
  });
}

function handleSelect(checkedKeys: any, event: any) {
  if (!event.selected) {
    return;
  }
  let item = event.selectedNodes[0];
  // setFieldsValue({
  //   ...item,
  //   parentId: item.parentId + "",
  // });
}
</script>

<style lang="less" scoped>
/deep/.ant-card-head {
  height: 60px;
}
</style>
