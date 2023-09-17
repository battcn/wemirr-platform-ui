<template>
  <fs-page class="page-layout-card">
    <fs-crud ref="crudRef" v-bind="crudBinding">
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
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
import { useMessage } from "@/hooks/web/useMessage";
import { defHttp } from "@/utils/http/axios";

export default defineComponent({
  name: "OptLogForm",
  setup() {
    const { notification, createConfirm } = useMessage();
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();
    // 暴露的方法
    const { expose } = useExpose({ crudRef, crudBinding });
    // 你的crud配置
    const { crudOptions } = createCrudOptions({ expose });
    // 初始化crud配置
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
    const { resetCrudOptions } = useCrud({ expose, crudOptions });
    // 你可以调用此方法，重新初始化crud配置
    // resetCrudOptions(options)
    // 页面打开后获取列表数据
    onMounted(() => {
      expose.doRefresh();
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
