<template>
  <PageWrapper contentClass="flex">
    <a-card :bordered="false" class="w-1/3 menu">
      <a-button color="success" @click="resetFields">新增根节点</a-button>
      <BasicTree
        search
        checkStrictly
        @check="onTreeNodeCheck"
        ref="treeRef"
        :treeData="treeData"
        :replaceFields="{ key: 'id', title: 'name' }"
        @select="handleSelect"
        :actionList="actionList"
      />
    </a-card>
    <a-card title="菜单信息" :bordered="false" class="w-1/2 menu" style="margin-left: 10px">
      <BasicForm @register="register" />
    </a-card>
    <a-card :bordered="false" title="资源信息" class="w-1/2 menu-button-table">
      <fs-crud ref="crudRef" v-bind="crudBinding" />
    </a-card>
  </PageWrapper>
</template>

<script>
  import { defineComponent, onMounted, ref, unref, h } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTree } from '/@/components/Tree/index';
  import { PageWrapper } from '/@/components/Page';
  import { getMenuList } from '/@/api/sys/menu';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { schemas } from './data';
  import * as api from './api';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';

  export default defineComponent({
    name: 'AccountManagement',
    components: { BasicForm, BasicTree, PageWrapper },
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

      const [register, { getFieldsValue, setFieldsValue, resetFields, validate, setProps }] =
        useForm({
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 19,
          },
          schemas: schemas,
          actionColOptions: {
            offset: 20,
          },
          showResetButton: false,
          submitButtonOptions: {
            text: '提交',
          },
          submitFunc: customSubmitFunc,
        });

      async function customSubmitFunc() {
        try {
          await validate();
          await setProps({ submitButtonOptions: { loading: true } });
          await api.SaveOrUpdate(getFieldsValue()).then(() => {
            notification.success({ message: '操作成功', duration: 3 });
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
          iconType: 'warning',
          title: '确认',
          content: `确定删除 ${node.label} ？ 同时会级联删除子节点以及相关资源数据`,
          onOk: async () => {
            await api.DelObj(node.id).then((ret) => {
              notification.success({
                message: '删除成功',
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
                    class: 'ml-2',
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

      function handleSelect(checkedKeys, event) {
        if (!event.selected) {
          return;
        }
        nodeRef.value = event.selectedNodes[0].props;
        crudBinding.value.actionbar.buttons.add.show = true;
        setFieldsValue({ ...event.selectedNodes[0].props });
      }

      function onTreeNodeCheck(keys, event) {
        console.log('keys event', keys, event);
        if (!event.checked) {
        } else {
        }
      }

      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
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
  }
  .menu-button-table {
    margin-left: 10px;
    .fs-container {
      padding-right: 5px;
    }
    .ant-card-body {
      padding: 10px;
    }
  }
</style>
