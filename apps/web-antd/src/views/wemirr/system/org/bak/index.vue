<script lang="ts" setup name="OrgForm">
import { h, onMounted, ref } from 'vue';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
// import { BasicForm, useForm } from "@/components/Form";
// import { BasicTree, TreeActionItem, TreeActionType } from "@/components/Tree/index";
// import { PageWrapper } from "@/components/Page";
import { Card, Modal, notification } from 'ant-design-vue';

import { orgTrees } from '#/api/core/org';

import * as api from './api';
// import { getOrgList } from "@/api/sys/org";
// import { useMessage } from "@/hooks/web/useMessage";
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
    iconType: 'warning',
    title: '确认',
    content: `确定删除 ${node.label} ？ 同时会级联删除子节点以及相关资源数据`,
    onOk: async () => {
      await api.DelObj(node.id).then(() => {
        notification.success({
          message: '删除成功',
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
              class: 'ml-2',
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
              class: 'ml-2',
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
  const item = event.selectedNodes[0];
  // setFieldsValue({
  //   ...item,
  //   parentId: item.parentId + "",
  // });
}
</script>

<template>
  <PageWrapper content-class="flex">
    <Card :bordered="false">
      <template #extra>
        <!--        <a-button @click="handlePlus" v-if="hasPermission('sys:org:add')">新增根节点</a-button>-->
      </template>
      <BasicTree
        ref="treeRef"
        :action-list="actionList"
        :click-row-to-expand="false"
        :field-names="{ key: 'id', title: 'name' }"
        :tree-data="treeData"
        check-strictly
        search
        title="组织列表"
        tree-wrapper-class-name="h-[calc(100%-35px)] overflow-auto"
        @select="handleSelect"
      />
    </Card>
    <Card style="margin-left: 10px" title="组织管理">
      <!--      <BasicForm @register="register" />-->
    </Card>
  </PageWrapper>
</template>

<style lang="less" scoped>
/deep/.ant-card-head {
  height: 60px;
}
</style>
