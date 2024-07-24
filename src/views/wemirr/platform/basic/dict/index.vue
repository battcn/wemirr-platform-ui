<template>
  <PageWrapper contentClass="flex">
    <Card class="w-2/5 dict-list" style="min-height: 850px">
      <template #extra>
        <a-button color="success" @click="openFormWrapper" v-if="hasPermission('sys:dict:add')"
          >新增字典</a-button
        >
        <a-button color="success" @click="refreshDictCache" v-if="hasPermission('sys:dict:refresh')"
          >刷新缓存</a-button
        >
        <fs-form-wrapper ref="formWrapperRef" v-bind="formWrapperOptions" />
      </template>
      <BasicTree
        title="系统字典"
        search
        toolbar
        :checkable="false"
        ref="treeRef"
        :clickRowToExpand="false"
        :treeData="treeData"
        @select="handleSelect"
        :actionList="actionList"
      />
    </Card>
    <Card title="字典子项" class="w-full dict-item">
      <dict-item-table ref="dictItemTableRef" />
    </Card>
  </PageWrapper>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, h } from "vue";
import { Card } from "ant-design-vue";
import { BasicTree, TreeActionItem, TreeActionType } from "@/components/Tree";

import { PageWrapper } from "@/components/Page";
import { useMessage } from "@/hooks/web/useMessage";
import * as api from "./api";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons-vue";
import DictItemTable from "./item/index.vue";
import createFormOptions from "./crud";
import { usePermission } from "/@/hooks/web/usePermission";

/**
 * 表单对话框独立使用
 * @returns {{formWrapperRef, formWrapperOptions, openFormWrapper: openFormWrapper}}
 */
function useFormWrapperUsingTag(callback) {
  const formWrapperRef = ref();
  const formWrapperOptions = ref();
  formWrapperOptions.value = createFormOptions(callback);
  function openFormWrapper() {
    formWrapperRef.value.open(formWrapperOptions.value);
  }
  return {
    formWrapperRef,
    openFormWrapper,
    formWrapperOptions,
  };
}

export default defineComponent({
  name: "SysDictPage",
  components: { Card, BasicTree, PageWrapper, DictItemTable },
  setup() {
    const { notification, createConfirm } = useMessage();
    const treeData = ref();
    const actionList = ref<TreeActionItem[]>([]);
    const treeRef = ref<Nullable<TreeActionType>>(null);
    const dictItemTableRef = ref();
    const { hasPermission } = usePermission();
    const { formWrapperRef, openFormWrapper, formWrapperOptions } = useFormWrapperUsingTag(() =>
      loadDictList(),
    );
    // 页面打开后获取列表数据
    onMounted(() => {
      loadDictList();
    });

    function handleSelect(checkedKeys: any, event: any) {
      if (!event.selected) {
        return;
      }
      const nodeRef = event.selectedNodes[0];
      dictItemTableRef.value.crudBinding.search.initialForm = {
        dictId: nodeRef.id,
      };
      dictItemTableRef.value.crudBinding.addForm.initialForm = {
        dictId: nodeRef.id,
      };
      dictItemTableRef.value.crudBinding.actionbar.buttons.add.show = true;
      dictItemTableRef.value.setSearchFormData({ form: { dictId: nodeRef.id } });
      dictItemTableRef.value.doRefresh();
    }

    function handleEdit(node: any) {
      formWrapperOptions.value.initialForm = {
        id: node.id,
        code: node.code,
        name: node.name,
        sequence: node.sequence,
        description: node.description,
      };
      formWrapperOptions.value.columns["code"].component.disabled = true;
      openFormWrapper();
    }

    function handleDelete(node: any) {
      createConfirm({
        iconType: "error",
        title: "删除",
        content: `会级联删除子节点以及相关资源数据`,
        onOk: async () => {
          await api.DelObj(node.id).then(() => {
            loadDictList();
            notification.success({
              message: "删除成功",
              duration: 3,
            });
          });
        },
      });
    }

    const refreshDictCache = () => {
      api.Refresh().then(() => {
        notification.success({
          message: "字典缓存刷新成功",
          duration: 3,
        });
      });
    };

    const loadDictList = () => {
      api.GetList().then((ret) => {
        treeData.value = ret;
        setTimeout(() => {
          actionList.value = [
            {
              show: hasPermission("sys:dict:edit"),
              render: (node) => {
                return h(EditOutlined, {
                  class: "ml-2",
                  onClick: (e) => {
                    handleEdit(node);
                    e.stopPropagation();
                  },
                });
              },
            },
            {
              show: hasPermission("sys:dict:remove"),
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
        }, 100);
      });
    };

    return {
      hasPermission,
      formWrapperRef,
      openFormWrapper,
      formWrapperOptions,
      refreshDictCache,
      loadDictList,
      dictItemTableRef,
      actionList,
      treeData,
      treeRef,
      handleSelect,
    };
  },
});
</script>

<style lang="less" scoped>
/deep/.dict-list {
  .ant-card-body {
    padding: 10px;
  }
}

/deep/.dict-item {
  margin-left: 10px;

  .fs-container {
    padding-right: 5px;
  }

  .ant-card-body {
    padding: 0;
  }

  .fs-page {
    margin-top: 60px;
  }

  .ant-card-head {
    height: 60px;
  }
}
</style>
