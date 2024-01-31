<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_action="scope">
        <a-tooltip placement="top" :title="scope.row.action">
          {{ scope.row.action }}
        </a-tooltip>
      </template>
      <template #actionbar-right>
        <a-dropdown type="primary" class="ml-1">
          <template #overlay>
            <a-menu @click="handleMenuClick">
              <a-menu-item key="1">一天前</a-menu-item>
              <a-menu-item key="7">七天前</a-menu-item>
              <a-menu-item key="15">十五天前</a-menu-item>
              <a-menu-item key="30">三十天前</a-menu-item>
            </a-menu>
          </template>
          <a-button>
            批量删除
            <DownOutlined />
          </a-button>
        </a-dropdown>
      </template>
    </fs-crud>
  </fs-page>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useFs } from "@fast-crud/fast-crud";
import { useMessage } from "@/hooks/web/useMessage";
import { defHttp } from "@/utils/http/axios";

export default defineComponent({
  name: "OptLogPage",
  setup() {
    const { notification, createConfirm } = useMessage();
    const { crudRef, crudBinding, crudExpose } = useFs({ createCrudOptions, context: {} });
    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });

    const handleMenuClick = (e) => {
      createConfirm({
        iconType: "warning",
        title: "提示",
        content: "是否批量删除",
        onOk: async () => {
          defHttp.request({ url: `/authority/opt_logs/${e.key}`, method: "delete" }).then((ret) => {
            notification.success({
              message: "批量删除成功",
              duration: 3,
            });
            expose.doRefresh();
          });
        },
      });
    };
    return {
      handleMenuClick,
      crudBinding,
      crudRef,
    };
  },
});
</script>
