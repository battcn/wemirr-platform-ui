<template>
  <Page content-class="flex gap-2">
    <Card class="w-1/3 menu">
      <template #extra>
        <a-button>新增根节点</a-button>
      </template>
      <a-tree
          v-model:expandedKeys="expandedKeys"
          :auto-expand-parent="true"
          :default-expand-all="true"
          :treeData="treeData"
          :fieldNames="{ key: 'id', title: 'name' }"
          :actionList="actionList"
          @select="handleSelect"
      />
    </Card>
    <Card title="菜单信息" class="w-1/2 menu" style="">
      <BaseForm/>
    </Card>
    <Card title="资源信息" class="w-1/2 res-button-table">
      <resource-button-table ref="itemTableRef"/>
    </Card>
  </Page>
</template>

<script setup lang="ts" name="SysMenuPage">
import {onMounted, ref, h} from "vue";
import {Card, Modal, notification} from "ant-design-vue";
import {getAllMenusApi} from "#/api";
// import { schemas } from "./data";
import * as api from "./api";
import {PlusOutlined, DeleteOutlined} from "@ant-design/icons-vue";
import ResourceButtonTable from "./button/index.vue";
import {Page} from "@vben/common-ui";
import {useVbenForm} from "#/adapter/form";
import {defHttp} from "#/api/request";
import { $t } from '#/locales';

// const { hasPermission } = usePermission();

const actionList = ref<any>([]);
const treeData = ref();
const expandedKeys = ref();
const itemTableRef = ref();

function onSubmit(values: Record<string, any>) {
  defHttp.post('/iam/areas', values).then(() => {
    baseFormApi.resetForm()
    // loadAreaTree();
    notification.success({
      description: "提交成功",
      duration: 3,
      message: $t('authentication.loginSuccess'),
    })
  })
}


const [BaseForm, baseFormApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full menu',
    },
  },
  // 提交函数
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
      fieldName: "id",
      component: "Input",
      label: "ID",
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
    },
    {
      fieldName: "parentId",
      component: "Input",
      label: "上级ID",
      defaultValue: 0,
      dependencies: {
        show: false,
        triggerFields: ['id'],
      },
      componentProps: {
        disabled: true,
        placeholder: "请填写上级ID",
      },
      rules: 'required',
    },
    {
      fieldName: "label",
      component: "Input",
      label: "名称",
      componentProps: {
        placeholder: "请输入名称",
      },
      rules: 'required',
    },
    {
      fieldName: "permission",
      component: "Input",
      label: "资源编码",
      componentProps: {
        placeholder: "请输入名称",
      },
    },
    {
      fieldName: "icon",
      component: "Input",
      label: "图标",
      // componentProps: { placeholder: "请选择图标" },
      rules: 'required',
    },
    {
      fieldName: "type",
      component: "RadioGroup",
      label: "类型",
      help: "一键发布则需在开发平台中提前配置一键发布模板",
      defaultValue: 1,
      componentProps: {
        options: [
          {
            label: "菜单",
            value: 1,
          },
          // {
          //   label: "一键发布",
          //   value: 5,
          // },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: "path",
      component: "Input",
      label: "路径",
      show: ({model}) => {
        return model.type === 1;
      },
      componentProps: {
        placeholder: "请填写路径",
      },
      itemProps: {
        extra: "路径内容填写 http 地址则为外链网页",
      },
      rules: 'required',
    },
    {
      fieldName: "component",
      component: "Input",
      label: "组件",
      help: "填写 Layout 则为页面布局 , 填写 http 地址则为内嵌网页",
      show: ({model}) => {
        return model.type === 1;
      },
      componentProps: {
        placeholder: "请填写组件",
      },
      defaultValue: "BasicLayout",
      itemProps: {
        extra: "填写 http 地址则为内嵌网页",
      },

    },
    {
      fieldName: "status",
      component: "RadioGroup",
      label: "状态",
      defaultValue: true,
      componentProps: {
        options: [
          {label: "启用", value: true},
          {label: "禁用", value: false},
        ],
      },
    },
    {
      fieldName: "display",
      component: "RadioGroup",
      label: "状态",
      defaultValue: true,
      componentProps: {
        // placeholder: "请选择显示还是隐藏",
        options: [
          {label: "显示", value: true},
          {label: "隐藏", value: false},
        ],
      },
    },
    {
      fieldName: "global",
      component: "RadioGroup",
      label: "全局",
      help: "所有人都能看到该菜单",
      defaultValue: false,
      componentProps: {
        options: [
          {label: "是", value: true},
          {label: "否", value: false},
        ],
      },
    },
    {
      fieldName: "sequence",
      component: "InputNumber",
      label: "排序",
      defaultValue: 0,
      componentProps: {
        placeholder: "请填写排序",
        min: 0,
        max: 100,
      },
      componentProps: {
        extra: "数值越小优先级越高",
      },
    },
    {
      fieldName: "description",
      component: "Textarea",
      label: "描述",
      componentProps: {
        placeholder: "请填写描述信息",
        rows: 4,
      },

    },
  ],
});


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
    expandedKeys.value = ret.filter((item:any) => item.parentId === '0').map((item:any) => item.id);
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
  console.log('==>>>', checkedKeys, nodeRef)
  baseFormApi.setValues({
    ...nodeRef
  });
  itemTableRef.value.crudBinding.search.initialForm = {parentId: nodeRef.id};
  itemTableRef.value.crudBinding.addForm.initialForm = {parentId: nodeRef.id};
  itemTableRef.value.crudBinding.actionbar.buttons.add.show = nodeRef.component !== 'BasicLayout' && nodeRef?.children === undefined;
  itemTableRef.value.parentId = nodeRef.id;
  itemTableRef.value.setSearchFormData({form: {parentId: nodeRef.id}});
  itemTableRef.value.doRefresh();
}
</script>

<style lang="less" scoped>
/deep/.p-4{
  padding: 0.5rem;
}
/deep/.res-button-table{
  .ant-card-body{
    padding: 12px;
  }
  .fs-container{
    min-height: 710px;
  }
}
</style>
