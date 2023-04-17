<template>
  <PageWrapper contentClass="flex">
    <a-card :bordered="false" class="w-1/3 menu">
      <a-button color="success" @click="resetFields">新增根节点</a-button>
      <BasicTree
        search
        checkStrictly
        ref="treeRef"
        :clickRowToExpand="false"
        :treeData="treeData"
        :fieldNames="{ key: 'id', title: 'name' }"
        @select="handleSelect"
        :actionList="actionList"
      />
    </a-card>
    <a-card title="组织管理" :bordered="false" class="w-full menu" style="margin-left: 10px">
      <BasicForm @register="register" />
    </a-card>
  </PageWrapper>
</template>

<script>
  import { defineComponent, onMounted, ref, unref, h } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTree } from '/@/components/Tree/index';
  import { PageWrapper } from '/@/components/Page';
  import { getOrgList } from '/@/api/sys/org';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { schemas } from './data';
  import * as api from './api';
  import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'OrgForm',
    components: { BasicForm, BasicTree, PageWrapper },
    setup() {
      const { notification, createConfirm } = useMessage();
      const actionList = ref([]);
      const treeRef = ref({});
      const treeData = ref();

      const [register, { getFieldsValue, setFieldsValue, resetFields, validate, setProps }] =
        useForm({
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 19,
          },
          schemas: schemas,
          baseColProps:{lg:24,md:24},
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
            loadOrgList();
          });
        } catch (error) {
          setProps({ submitButtonOptions: { loading: false } });
        }
      }

      onMounted(() => {
        loadOrgList();
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
              loadOrgList();
            });
          },
        });
      }

      function loadOrgList() {
        getOrgList().then((ret) => {
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
        setFieldsValue({
          ...event.selectedNodes[0],
        });
      }
      function getTree() {
        const tree = unref(treeRef);
        if (!tree) {
          throw new Error('tree is null!');
        }
        return tree;
      }

      return {
        register,
        treeData,
        treeRef,
        actionList,
        resetFields,
        handleSelect,
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
