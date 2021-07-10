<template>
  <PageWrapper>
    <a-row class="row-res">
      <a-col :span="5">
        <a-card :bordered="false" style="min-height: 800px">
          <BasicTree
            search
            checkable
            checkStrictly
            @check="onTreeNodeCheck"
            ref="permissionTreeRef"
            :treeData="permissionTreeData"
            :replaceFields="{ key: 'id', title: 'name' }"
            @select="handleSelect"
          />
        </a-card>
      </a-col>
      <a-col :span="9">
        <a-card title="资源信息" :bordered="false" style="margin-left: 10px; min-height: 800px">
          <BasicForm @register="register" class="bg-white m-10 overflow-hidden" />
        </a-card>
      </a-col>
      <a-col :span="10">
        <a-card title="资源信息" :bordered="false" style="margin-left: 10px; min-height: 800px">
          <fs-crud ref="crudRef" v-bind="crudBinding" />
        </a-card>
      </a-col>
    </a-row>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTree, TreeActionType } from '/@/components/Tree';
  import { PageWrapper } from '/@/components/Page';
  import { getMenuList } from '/@/api/sys/menu';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import { schemas } from './data';

  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';

  export default defineComponent({
    name: 'AccountManagement',
    components: { BasicForm, BasicTree, PageWrapper },
    setup() {
      const permissionTreeRef = ref<Nullable<TreeActionType>>(null);
      const permissionTreeData = ref();
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
      const { resetCrudOptions } = useCrud({ expose, crudOptions });

      const [register, { setFieldsValue, validate, setProps }] = useForm({
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
          await setProps({
            submitButtonOptions: {
              loading: true,
            },
          });
          setTimeout(() => {
            setProps({
              submitButtonOptions: {
                loading: false,
              },
            });
            // createMessage.success('提交成功！');
          }, 2000);
        } catch (error) {}
      }

      onMounted(() => {
        getMenuList();
        // expose.doRefresh({ test: '1000' });
      });

      getMenuList().then((ret) => {
        permissionTreeData.value = ret;
        setTimeout(() => {
          getTree().filterByLevel(2);
        }, 0);
      });

      function handleSelect(checkedKeys, event) {
        if (!event.selected) {
          return;
        }
        nodeRef.value = event.selectedNodes[0].props;
        expose.doRefresh();
        console.log('event', event.selectedNodes[0].props);
        setFieldsValue({
          ...event.selectedNodes[0].props,
        });
      }
      function onTreeNodeCheck(keys, event) {
        console.log('event', event);
        if (!event.checked) {
        } else {
        }
      }

      function getTree() {
        const tree = unref(permissionTreeRef);
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
        permissionTreeData,
        permissionTreeRef,
        handleSelect,
        onTreeNodeCheck,
      };
    },
  });
</script>

<style lang="less">
  .row-res {
    height: 100%;
    width: 100%;
  }
  .ant-card {
    .fs-crud-container {
      .box {
        margin-left: -20px;
        margin-top: -20px;
      }
    }
  }
</style>
