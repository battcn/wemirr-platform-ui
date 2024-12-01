<template>
  <Page content-class="flex gap-2">
    <Card class="w-1/3 menu" style="width: 25%">
      <template #extra>
<!--        <a-button @click="resetFields" v-if="hasPermission('sys:menu:add')">新增根节点</a-button>-->
      </template>
      asdsadasd
      asdasd
      sadas
<!--      <BasicTree
        search
        title="菜单"
        checkStrictly
        ref="treeRef"
        :treeData="treeData"
        :fieldNames="{ key: 'id', title: 'name' }"
        @select="handleSelect"
        :actionList="actionList"
      />-->
    </Card>
    <Card title="菜单信息" class="w-1/2 menu" style=" width: 45%;margin-left: 5px">
<!--      <BasicForm @register="register" />-->
    </Card>
    <Card title="资源信息" class="w-1/2 menu-button-table">
      <resource-button-table ref="itemTableRef" />
    </Card>
  </Page>
</template>

<script setup lang="ts" name="SysMenuPage">
import { onMounted, ref, unref, h } from "vue";
import {Card, Modal, notification} from "ant-design-vue";
import { getAllMenusApi } from "#/api";
// import { schemas } from "./data";
import * as api from "./api";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import ResourceButtonTable from "./button/index.vue";
import {Page} from "@vben/common-ui";

// const { hasPermission } = usePermission();

const actionList = ref<any>([]);
const treeData = ref();
const itemTableRef = ref();

// const [register, { getFieldsValue, setFieldsValue, resetFields, validate, setProps }] = useForm({
//   labelCol: { span: 4 },
//   wrapperCol: { span: 19 },
//   schemas: schemas,
//   baseColProps: { lg: 24, md: 24 },
//   actionColOptions: { offset: 20 },
//   showResetButton: false,
//   submitButtonOptions: { text: "提交" },
//   submitFunc: customSubmitFunc,
// });

async function customSubmitFunc() {
  // try {
  //   await validate();
  //   await setProps({ submitButtonOptions: { loading: true } });
  //   await api.SaveOrUpdate(getFieldsValue()).then(() => {
  //     notification.success({ message: "操作成功", duration: 3 });
  //     setProps({ submitButtonOptions: { loading: false } });
  //     resetFields();
  //     loadMenu();
  //   });
  // } catch (error) {
  //   await setProps({ submitButtonOptions: { loading: false } });
  // }
}

onMounted(() => {
  loadMenu();
});

function handlePlus(node: any) {
  // resetFields();
  // setFieldsValue({ parentId: node.id });
}
function handleDelete(node: any) {
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
        loadMenu();
      });
    },
  });
}

function loadMenu() {
  getAllMenusApi().then((ret) => {
    treeData.value = ret;
    setTimeout(() => {
      actionList.value = [
        {
          // show: hasPermission("sys:menu:add"),
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
          // show: hasPermission("sys:menu:remove"),
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
  // resetFields();
  const nodeRef = event.selectedNodes[0];
  // setFieldsValue({ ...nodeRef });
  itemTableRef.value.crudBinding.search.initialForm = { parentId: nodeRef.id };
  itemTableRef.value.crudBinding.addForm.initialForm = { parentId: nodeRef.id };
  itemTableRef.value.crudBinding.actionbar.buttons.add.show = true;
  itemTableRef.value.parentId = nodeRef.id;
  itemTableRef.value.setSearchFormData({ form: { parentId: nodeRef.id } });
  itemTableRef.value.doRefresh();
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
