<template>
  <fs-page class="page-layout-card">
    <fs-crud v-if="crudBinding" ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right>
        <a-alert
          class="ml-1"
          style="margin-top: 10px"
          type="info"
          message="限访名单存储在Redis中，为了查询方便做的本地分页，一般黑名单也不会太多"
        />
      </template>
    </fs-crud>
  </fs-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useFs } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import { GetList } from "./api";

export default defineComponent({
  name: "GatewayBlackPageList",
  setup() {
    // crud组件的ref
    const crudRef = ref();
    // crud 配置的ref
    const crudBinding = ref();

    const localDataRef = ref();

    onMounted(async () => {
      //先加载后台数据
      localDataRef.value = await GetList({
        page: { offset: 0, current: 1, size: 99999999 },
        query: {},
        sort: {},
      });

      const { crudExpose } = useFs({
        crudBinding,
        crudRef,
        createCrudOptions,
        context: { localDataRef },
      });

      // 页面打开后获取列表数据
      await crudExpose.doRefresh();
    });

    return {
      crudBinding,
      crudRef,
    };
  },
});
</script>
