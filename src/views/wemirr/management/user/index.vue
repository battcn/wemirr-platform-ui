<template>
  <PageWrapper contentClass="flex" contentFullHeight fixedHeight class="bg-white m-4 mr-4">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_nickName="scope">
        <a-tooltip placement="top" :title="scope.row.nickName">
          {{ scope.row.nickName }}
        </a-tooltip>
      </template>
    </fs-crud>
  </PageWrapper>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
import { PageWrapper } from "@/components/Page";
import { Card } from "ant-design-vue";

export default defineComponent({
  name: "FormGroup",
  components: { PageWrapper, Card },
  setup() {
    const crudRef = ref();
    const crudBinding = ref();
    const { expose } = useExpose({ crudRef, crudBinding });
    const { crudOptions } = createCrudOptions({ expose });
    useCrud({ expose, crudOptions, permission: "user:management" });

    // 页面打开后获取列表数据
    onMounted(() => {
      expose.doRefresh();
    });

    return {
      crudBinding,
      crudRef,
    };
  },
});
</script>

<style lang="less">
.station {
  margin-left: 10px;
  min-height: 820px;
  .footer {
    .fs-crud-footer {
      padding: 20px 0;
    }
  }
  .fs-toolbar {
    margin-right: 10px;
  }
  .ant-card-body {
    margin-top: -12px;
  }
}
</style>
