<template>
  <PageWrapper contentClass="flex">
    <Card class="w-1/3 menu" style="width: 25%">
      <template #extra>
        <a-button @click="resetFields" v-if="hasPermission('sys:menu:add')">新增根节点</a-button>
      </template>
      <BasicTree
        search
        title="菜单"
        checkStrictly
        ref="treeRef"
        :treeData="treeData"
        :fieldNames="{ key: 'id', title: 'name' }"
        @select="handleSelect"
        :actionList="actionList"
      />
    </Card>
    <Card title="菜单信息" class="w-1/2 menu" style="margin-left: 5px; width: 45%">
      <BasicForm @register="register" />
    </Card>
    <Card title="资源信息" class="w-1/2 menu-button-table">
      <resource-button-table ref="itemTableRef" />
    </Card>
  </PageWrapper>
</template>

<script setup lang="ts" name="SysMenuPage">
import { onMounted, ref, unref, h } from "vue";
import { Card } from "ant-design-vue";
import { BasicForm, useForm } from "@/components/Form";
import { BasicTree, TreeActionItem, TreeActionType } from "@/components/Tree/index";
import { PageWrapper } from "@/components/Page";
import { getMenuList } from "@/api/sys/menu";
import { useMessage } from "@/hooks/web/useMessage";
import { schemas } from "./data";
import * as api from "./api";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { usePermission } from "@/hooks/web/usePermission";
import ResourceButtonTable from "./button/index.vue";

const { hasPermission } = usePermission();

const { notification, createConfirm } = useMessage();
const actionList = ref<TreeActionItem[]>([]);
const treeRef = ref<Nullable<TreeActionType>>(null);
const treeData = ref();
const itemTableRef = ref();

const [register, { getFieldsValue, setFieldsValue, resetFields, validate, setProps }] = useForm({
  labelCol: { span: 4 },
  wrapperCol: { span: 19 },
  schemas: schemas,
  baseColProps: { lg: 24, md: 24 },
  actionColOptions: { offset: 20 },
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
      loadMenu();
    });
  } catch (error) {
    await setProps({ submitButtonOptions: { loading: false } });
  }
}

onMounted(() => {
  loadMenu();
});

function handlePlus(node: any) {
  resetFields();
  setFieldsValue({ parentId: node.id });
}
function handleDelete(node: any) {
  createConfirm({
    iconType: "warning",
    title: "确认",
    content: `确定删除 ${node.label} ？ 同时会级联删除子节点以及相关资源数据`,
    onOk: async () => {
      await api.DelObj(node.id).then(() => {
        notification.success({
          message: "删除成功",
          duration: 3,
        });
        loadMenu();
      });
    },
  });
}

function loadMenu() {
  getMenuList().then((ret) => {
    treeData.value = ret;
    setTimeout(() => {
      getTree().filterByLevel(2);
      actionList.value = [
        {
          show: hasPermission("sys:menu:add"),
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
          show: hasPermission("sys:menu:remove"),
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
  resetFields();
  const nodeRef = event.selectedNodes[0];
  setFieldsValue({ ...nodeRef });
  itemTableRef.value.crudBinding.search.initialForm = { parentId: nodeRef.id };
  itemTableRef.value.crudBinding.addForm.initialForm = { parentId: nodeRef.id };
  itemTableRef.value.crudBinding.actionbar.buttons.add.show = true;
  itemTableRef.value.parentId = nodeRef.id;
  itemTableRef.value.setSearchFormData({ form: { parentId: nodeRef.id } });
  itemTableRef.value.doRefresh();
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
/deep/.menu {
  .ant-card-body {
    padding: 0;
  }
}
/deep/.menu-button-table {
  margin-left: 5px;
  .fs-container {
    padding-right: 5px;
  }
  .ant-card-body {
    padding: 5px !important;
  }
}
</style>
