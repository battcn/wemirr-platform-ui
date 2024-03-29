<template>
  <PageWrapper contentClass="flex">
    <Card class="w-1/3 menu" style="width: 25%">
      <template #extra>
        <a-button @click="resetFields">新增根节点</a-button>
      </template>
      <BasicTree
        search
        checkStrictly
        @check="onTreeNodeCheck"
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
      <fs-crud ref="crudRef" v-bind="crudBinding" />
    </Card>
  </PageWrapper>
</template>

<script>
import { defineComponent, onMounted, ref, unref, h } from "vue";
import { Card } from "ant-design-vue";
import { BasicForm, useForm } from "@/components/Form";
import { BasicTree } from "@/components/Tree/index";
import { PageWrapper } from "@/components/Page";
import { getMenuList } from "@/api/sys/menu";
import { useMessage } from "@/hooks/web/useMessage";
import { schemas } from "./data";
import * as api from "./api";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";

import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";

export default defineComponent({
  name: "SysMenuPage",
  components: { Card, BasicForm, BasicTree, PageWrapper },
  setup() {
    const { notification, createConfirm } = useMessage();
    const actionList = ref([]);
    const treeRef = ref({});
    const treeData = ref();
    const nodeRef = ref();
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();
    // 暴露的方法
    const { expose } = useExpose({ crudRef, crudBinding });
    // 你的crud配置
    const { crudOptions } = createCrudOptions({ expose, nodeRef });
    // 初始化crud配置
    useCrud({ expose, crudOptions });

    const [register, { getFieldsValue, setFieldsValue, resetFields, validate, setProps }] = useForm(
      {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 19,
        },
        schemas: schemas,
        baseColProps: { lg: 24, md: 24 },
        actionColOptions: {
          offset: 20,
        },
        showResetButton: false,
        submitButtonOptions: {
          text: "提交",
        },
        submitFunc: customSubmitFunc,
        submit: customSubmitFunc,
      },
    );

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
        setProps({ submitButtonOptions: { loading: false } });
      }
    }

    onMounted(() => {
      loadMenu();
    });

    function handlePlus(node) {
      resetFields();
      setFieldsValue({ parentId: node.id });
    }
    function handleDelete(node) {
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

    function handleSelect(checkedKeys, event) {
      if (!event.selected) {
        return;
      }
      resetFields();
      nodeRef.value = event.selectedNodes[0];
      crudBinding.value.actionbar.buttons.add.show = true;
      setFieldsValue({ ...event.selectedNodes[0] });
      expose.doRefresh();
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

    return {
      nodeRef,
      crudBinding,
      crudRef,
      register,
      treeData,
      treeRef,
      actionList,
      resetFields,
      handleSelect,
      onTreeNodeCheck,
      handlePlus,
    };
  },
});
</script>

<style lang="less">
.menu {
  .ant-card-body {
    padding: 10px;
  }
  //width: 40%;
}
.menu-button-table {
  margin-left: 5px;
  .fs-container {
    padding-right: 5px;
  }
  .ant-card-body {
    padding: 5px !important;
  }
}
</style>
