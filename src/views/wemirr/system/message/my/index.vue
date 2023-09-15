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
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
import { useMessage } from "@/hooks/web/useMessage";
import * as api from "./api";

export default defineComponent({
  name: "MyMessage",
  setup() {
    const { createMessage, notification, createConfirm } = useMessage();
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();
    // 暴露的方法
    const { expose } = useExpose({ crudRef, crudBinding });
    // 你的crud配置
    const { crudOptions, selectedRowKeys } = createCrudOptions({ expose });
    // 初始化crud配置
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose, crudOptions });
    // 你可以调用此方法，重新初始化crud配置
    // resetCrudOptions(options)
    // 页面打开后获取列表数据
    onMounted(() => {
      expose.doRefresh();
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
