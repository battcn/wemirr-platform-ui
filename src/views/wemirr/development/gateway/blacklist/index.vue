<template>
  <PageWrapper contentClass="flex" contentFullHeight fixedHeight class="bg-white m-4 mr-4">
    <fs-crud v-if="crudBinding" ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right>
        <a-alert
          class="ml-1"
          type="info"
          message="限访名单存储在Redis中，为了查询方便做的本地分页，一般黑名单也不会太多"
        />
      </template>
    </fs-crud>
  </PageWrapper>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useCrud, useExpose } from "@fast-crud/fast-crud";
import createCrudOptions from "./crud";
import { GetList } from "./api";
import { PageWrapper } from "@/components/Page";

/**
 * 本示例演示如何本地分页
 * 主要就是将pageRequest修改为从本地获取数据就行了
 */
export default defineComponent({
  name: "BlackListForm",
  components: { PageWrapper },
  setup() {
    const crudRef = ref();
    const crudBinding = ref();
    const localDataRef = ref();

    onMounted(async () => {
      //先加载后台数据
      const ret = await GetList({
        page: { offset: 0, current: 1, size: 99999999 },
        query: {},
        sort: {},
      });
      localDataRef.value = ret.data;

      //然后再初始化crud
      // 暴露的方法
      const { expose } = useExpose({ crudRef, crudBinding });
      // 你的crud配置
      const { crudOptions } = createCrudOptions({ expose, localDataRef });
      // 初始化crud配置
      useCrud({ expose, crudOptions });

      // 页面打开后获取列表数据
      await expose.doRefresh();
    });

    return {
      crudBinding,
      crudRef,
    };
  },
});
</script>
