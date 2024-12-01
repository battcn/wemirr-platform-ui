<template>
  <Page content-class="flex gap-2 sys-menu-view">
    <Card class="w-1/3 menu">
      <template #extra>
        <a-button @click="addDirectory" type="primary">新增目录</a-button>
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
    <Card title="菜单信息" class="w-1/2">
      <BaseForm/>
    </Card>
    <Card title="资源信息" class="w-1/2">
      <resource-button-table ref="itemTableRef"/>
    </Card>
  </Page>
</template>

<script setup lang="ts" name="SysMenuPage">
import {onMounted, ref, h} from "vue";
import {Card, Modal, notification} from "ant-design-vue";
import {getAllMenusApi} from "#/api";
import * as api from "./api";
import {PlusOutlined, DeleteOutlined} from "@ant-design/icons-vue";
import ResourceButtonTable from "./button/index.vue";
import {Page, VbenButton} from '@vben/common-ui';
import {useVbenForm} from "#/adapter/form";
import {defHttp} from "#/api/request";
import {$t} from '#/locales';

// const { hasPermission } = usePermission();

const actionList = ref<any>([]);
const treeData = ref();
const expandedKeys = ref();
const itemTableRef = ref();

function onSubmit(values: Record<string, any>) {
  defHttp.post('/iam/resources', values).then(() => {
    baseFormApi.resetForm()
    // loadAreaTree();
    notification.success({
      description: "提交成功",
      duration: 3,
      message: $t('authentication.loginSuccess'),
    })
    baseFormApi.resetValidate();
  })
}


const [BaseForm, baseFormApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
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
      fieldName: "type",
      component: "RadioGroup",
      label: "类型",
      dependencies: {
        trigger(values, formApi) {
          if (values.type === 0) {
            formApi.setValues({component: 'BasicLayout'})
          } else if (values.type === 11 || values.type === 12) {
            formApi.setValues({component: 'IFrameView'})
          } else {
            formApi.setValues({component: '' })
          }
        },
        triggerFields: ['type'],
      },
      componentProps: {
        options: [
          {label: "目录", value: 0},
          {label: "菜单", value: 1},
          {label: "外链", value: 11},
          {label: "内嵌", value: 12},
        ],
      },
      rules: 'required',
    },
    {
      fieldName: "path",
      component: "Input",
      label: "路径",
      componentProps: {
        placeholder: "请填写路径",
        extra: "路径内容填写 http 地址则为外链网页",
      },
      rules: 'required',
    },
    {
      fieldName: "component",
      component: "Input",
      label: "组件",
      help: "填写 Layout 则为页面布局 , 填写 http 地址则为内嵌网页",
      componentProps: {
        placeholder: "请填写组件",
      },
      dependencies: {
        show(values) {
          return values.type === 1;
        },
        triggerFields: ['type'],
      },
    },
    {
      fieldName: "url",
      component: "Input",
      label: "地址",
      help: "填写 Http 地址",
      componentProps: {
        placeholder: "请填写链接地址",
      },
      dependencies: {
        show(values) {
          return values.type === 11 || values.type === 12;
        },
        triggerFields: ['type'],
      },
    },
    {
      fieldName: "title",
      component: "Input",
      label: "标题",
      componentProps: {
        placeholder: "请输入路由标题",
      },
      rules: 'required',
    },
    {
      fieldName: "permission",
      component: "Input",
      label: "编码",
      componentProps: {
        placeholder: "请输入路由权限码",
      },
    },
    {
      fieldName: "icon",
      component: "Input",
      label: "图标",
      rules: 'required',
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
    // {
    //   fieldName: "display",
    //   component: "RadioGroup",
    //   label: "状态",
    //   defaultValue: true,
    //   componentProps: {
    //     // placeholder: "请选择显示还是隐藏",
    //     options: [
    //       {label: "显示", value: true},
    //       {label: "隐藏", value: false},
    //     ],
    //   },
    // },
    // {
    //   fieldName: "global",
    //   component: "RadioGroup",
    //   label: "全局",
    //   help: "所有人都能看到该菜单",
    //   defaultValue: false,
    //   componentProps: {
    //     options: [
    //       {label: "是", value: true},
    //       {label: "否", value: false},
    //     ],
    //   },
    // },
    {
      fieldName: "sequence",
      component: "InputNumber",
      label: "排序",
      defaultValue: 0,
      componentProps: {
        placeholder: "请填写排序",
        help: "数值越小优先级越高",
        min: 0,
        max: 100,
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

onMounted(() => {
  loadMenu();
  baseFormApi.setValues({
    type: 0,
    parentId: '0',
    component: 'BasicLayout'
  });
  baseFormApi.setState({ showDefaultActions: false });
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
    expandedKeys.value = ret.filter((item: any) => item.parentId === '0').map((item: any) => item.id);
    setTimeout(() => {
      actionList.value = [
        {
          // show: hasPermission("sys:menu:add"),
          render: (node: any) => {
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
          render: (node: any) => {
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
    baseFormApi.resetValidate();
  });
}

function addDirectory() {
  itemTableRef.value.crudBinding.actionbar.buttons.add.show = false;
  itemTableRef.value.parentId = '0';
  baseFormApi.resetForm()
  baseFormApi.setValues({
    type: 0,
    parentId: '0',
    component: 'BasicLayout'
  });
  baseFormApi.resetValidate();
  itemTableRef.value.setSearchFormData({form: {parentId: '0'}});
  itemTableRef.value.doRefresh();
  baseFormApi.setState({ showDefaultActions: true });
}

function handleSelect(checkedKeys: any, event: any) {
  if (!event.selected) {
    return;
  }
  baseFormApi.resetValidate();
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
  baseFormApi.setState({ showDefaultActions: true });
}
</script>

<style lang="less" scoped>
/deep/ .p-4 {
  padding: 0.5rem;
}

/deep/ .sys-menu-view {
  .ant-card-body {
    padding: 12px;
  }

  .fs-container {
    min-height: 720px;
  }
}
</style>
