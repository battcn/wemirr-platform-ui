<template>
  <PageWrapper contentClass="flex">
    <Card class="w-2/5">
      <template #extra>
        <a-tooltip
          placement="right"
          title="鉴于地址变动频率较低,切不易维护,故禁用,有需求的请 Fork 代码放开限制即可"
        >
          <a-button color="success" disabled @click="resetFields">新增省份</a-button>
          <a-button color="success" disabled @click="batchDelete" style="margin-left: 15px">
            批量删除
          </a-button>
        </a-tooltip>
      </template>
      <BasicTree
        title="搜索"
        search
        toolbar
        :checkable="true"
        ref="treeRef"
        :clickRowToExpand="false"
        :treeData="treeData"
        :fieldNames="{ key: 'id', title: 'name' }"
        @select="handleSelect"
        :actionList="actionList"
      />
    </Card>
    <Card title="菜单信息" class="w-full" style="margin-left: 10px">
      <BasicForm @register="register" />
    </Card>
  </PageWrapper>
</template>

<script lang="ts" setup name="SysAreaForm">
import { onMounted, ref, unref, h } from "vue";
import { Card } from "ant-design-vue";
import { BasicForm, useForm } from "@/components/Form";
import { BasicTree, TreeActionItem, TreeActionType } from "@/components/Tree";

import { PageWrapper } from "@/components/Page";
import { getAreaTree } from "@/api/sys/area";
import { useMessage } from "@/hooks/web/useMessage";
import { schemas } from "./data";
import * as api from "./api";
import { PlusOutlined } from "@ant-design/icons-vue";

const { notification, createErrorModal, createConfirm } = useMessage();
const actionList = ref<TreeActionItem[]>([]);
const treeRef = ref<Nullable<TreeActionType>>(null);
const treeData = ref();

const [register, { getFieldsValue, setFieldsValue, resetFields, validate, setProps }] = useForm({
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
  schemas: schemas,
  baseColProps: { lg: 24, md: 24 },
  actionColOptions: { offset: 20 },
  showSubmitButton: false,
  showResetButton: false,
  submitButtonOptions: { text: "提交" },
  submitFunc: customSubmitFunc,
});

async function customSubmitFunc() {
  try {
    await validate();
    await setProps({ submitButtonOptions: { loading: true } });
    await api.SaveOrUpdate(getFieldsValue()).then(() => {
      notification.success({ message: "操作成功", duration: 3 });
      setProps({ submitButtonOptions: { loading: false } });
      resetFields();
      loadAreaTree();
    });
  } catch (error) {
    await setProps({ submitButtonOptions: { loading: false } });
  }
}

onMounted(() => {
  loadAreaTree();
});

function handleSelect(checkedKeys: any, event: any) {
  if (!event.selected) {
    return;
  }
  event.selectedNodes[0].name = event.selectedNodes[0].label;
  setFieldsValue({
    ...event.selectedNodes[0],
  });
}

function getTree() {
  const tree = unref(treeRef);
  if (!tree) {
    throw new Error("tree is null!");
  }
  return tree;
}

function batchDelete() {
  const keys = getTree().getCheckedKeys();
  if (!keys || keys.length <= 0) {
    createErrorModal({ title: "操作异常", content: "未勾选需要删除的数据" });
    return;
  }
  createConfirm({
    iconType: "warning",
    title: "确认",
    content: `确定删除 ${keys} ？ 同时会级联删除子节点以及相关资源数据`,
    onOk: async () => {
      await api.BatchDelete(keys).then(() => {
        notification.success({ message: "删除成功", duration: 3 });
        loadAreaTree();
      });
    },
  });
}

function handlePlus(node: any) {
  resetFields();
  setFieldsValue({ parentId: node.id });
}

function loadAreaTree() {
  getAreaTree().then((ret) => {
    treeData.value = ret;
    setTimeout(() => {
      actionList.value = [
        {
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
      ];
    }, 100);
  });
}
</script>
