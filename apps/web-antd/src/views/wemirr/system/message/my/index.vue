<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #pagination-left>
        <a-tooltip title="批量删除">
          <fs-button icon="DeleteOutlined" @click="handleBatchDelete" />
        </a-tooltip>
      </template>
      <template #cell_content="scope">
        <a-tooltip placement="top" :title="scope.row.content">
          {{ scope.row.content }}
        </a-tooltip>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useFs } from "@fast-crud/fast-crud";
import { useMessage } from "@/hooks/web/useMessage";
import * as api from "./api";

export default defineComponent({
  name: "SiteMessagePage",
  setup() {
    const { createMessage, notification, createConfirm } = useMessage();

    const { crudRef, crudBinding, selectedRowKeys, crudExpose } = useFs({ createCrudOptions });
    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });

    const handleBatchDelete = () => {
      if (selectedRowKeys.value?.length > 0) {
        createConfirm({
          iconType: "warning",
          title: "确认",
          content: `确定要批量删除这${selectedRowKeys.value.length}条记录吗`,
          onOk: async () => {
            await api.BatchDelete(selectedRowKeys.value);
            notification.success({
              message: "批量删除成功",
              duration: 3,
            });
            await expose.doRefresh();
            selectedRowKeys.value = [];
          },
        });
      } else {
        createMessage.error("请先勾选记录");
      }
    };

    return {
      handleBatchDelete,
      crudBinding,
      crudRef,
    };
  },
});
</script>
