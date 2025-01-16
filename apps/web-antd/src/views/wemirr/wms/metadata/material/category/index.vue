<script>
import { defineComponent, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Modal, notification } from 'ant-design-vue';

import * as api from './api';
// import {BasicForm, useForm} from "#/components/Form";
// import {BasicTree} from "#/components/Tree";
// import {PageWrapper} from "#/components/Page";
// import {useMessage} from "@/hooks/web/useMessage";

export default defineComponent({
  name: 'SysMenuPage',
  components: { Page, Card },
  setup() {
    // const {notification, createConfirm} = useMessage();
    const actionList = ref([]);
    const treeRef = ref({});
    const treeData = ref();
    // const [register, {getFieldsValue, setFieldsValue, resetFields, validate, setProps}] = useForm(
    //   {
    //     labelCol: {span: 4},
    //     wrapperCol: {span: 19},
    //     schemas: schemas,
    //     baseColProps: {lg: 24, md: 24},
    //     actionColOptions: {offset: 20},
    //     showResetButton: false,
    //     submitButtonOptions: {text: "提交"},
    //     submitFunc: customSubmitFunc,
    //     submit: customSubmitFunc,
    //   },
    // );

    function resetFields() {}
    async function customSubmitFunc() {
      try {
        await validate();
        await setProps({ submitButtonOptions: { loading: true } });
        await api.SaveOrUpdate(getFieldsValue()).then(() => {
          notification.success({ message: '操作成功', duration: 3 });
          setProps({ submitButtonOptions: { loading: false } });
          resetFields();
          loadMaterialType();
        });
      } catch {
        setProps({ submitButtonOptions: { loading: false } });
      }
    }

    onMounted(() => {
      loadMaterialType();
    });

    function handlePlus(node) {
      resetFields();
      setFieldsValue({ parentId: node.id });
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
            loadMaterialType();
          });
        },
      });
    }

    function loadMaterialType() {
      api.MaterialCategoryTree().then((ret) => {
        treeData.value = ret;
        // setTimeout(() => {
        //   getTree().filterByLevel(2);
        //   actionList.value = [
        //     {
        //       render: (node) => {
        //         return h(PlusOutlined, {
        //           class: "ml-2",
        //           onClick: (e) => {
        //             handlePlus(node);
        //             e.stopPropagation();
        //           },
        //         });
        //       },
        //     },
        //     {
        //       render: (node) => {
        //         return h(DeleteOutlined, {
        //           class: "ml-2",
        //           onClick: (e) => {
        //             handleDelete(node);
        //             e.stopPropagation();
        //           },
        //         });
        //       },
        //     },
        //   ];
        // }, 0);
      });
    }

    function handleSelect(checkedKeys, event) {
      if (!event.selected) {
        return;
      }
      resetFields();
      const node = event.selectedNodes[0];
      setFieldsValue({ ...event.selectedNodes[0], name: node.label });
    }

    function onTreeNodeCheck(keys, event) {}

    return {
      // register,
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

<template>
  <Page content-class="flex flex-row gap-2">
    <Card class="w-1/3">
      <template #extra>
        <a-button @click="resetFields">添加大类</a-button>
      </template>
      <!--      <a-tree
        search
        checkStrictly
        @check="onTreeNodeCheck"
        ref="treeRef"
        :treeData="treeData"
        :fieldNames="{ key: 'id', title: 'name' }"
        @select="handleSelect"
        :actionList="actionList"
      />-->
    </Card>
    <Card class="w-2/3" style="margin-left: 5px" title="物料类型">
      <!--      <BasicForm @register="register"/>-->
    </Card>
  </Page>
</template>
