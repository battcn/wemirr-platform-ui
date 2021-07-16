<template>
  <PageWrapper contentClass="flex" class="bg-white m-4 mr-0 overflow-hidden">
    <a-card :bordered="false" class="w-1/3 xl:w-1/4">
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
    <a-card title="菜单信息" :bordered="false" class="w-1/2 xl:w-1/2" style="margin-left: 10px">
      <BasicForm @register="register" class="bg-white m-10 overflow-hidden" />
    </a-card>
    <a-card :bordered="false" title="资源信息" class="w-1/2 xl:w-1/2" style="margin-left: 10px">
      <fs-crud ref="crudRef" v-bind="crudBinding" />
    </a-card>
  </PageWrapper>
</template>

<script>
  import { defineComponent, onMounted, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { BasicTree } from '/@/components/Tree';
  import { PageWrapper } from '/@/components/Page';
  import { getMenuList } from '/@/api/sys/menu';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { schemas } from './data';
  import * as api from './api';

  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';

  export default defineComponent({
    name: 'AccountManagement',
    components: { BasicForm, BasicTree, PageWrapper },
    setup() {
      const { notification } = useMessage();

      const permissionTreeRef = ref({});
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
      const { resetCrudOptions } = useCrud({ expose, crudOptions });

      const [register, { getFieldsValue, setFieldsValue, validate, setProps }] = useForm({
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
          console.log('getFieldsValue()', getFieldsValue());
          await api.UpdateObj(getFieldsValue()).then(() => {
            notification.success({ message: '修改成功', duration: 3 });
            setProps({ submitButtonOptions: { loading: false } });
            getMenuList();
          });
        } catch (error) {
          setProps({ submitButtonOptions: { loading: false } });
        }
      }

      onMounted(() => {
        getMenuList();
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
        crudBinding.value.actionbar.buttons.add.show = true;
        setFieldsValue({
          ...event.selectedNodes[0].props,
        });
        expose.doRefresh();
      }
      function onTreeNodeCheck(keys, event) {
        console.log('keys event', keys, event);
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
