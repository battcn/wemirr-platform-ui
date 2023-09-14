<template>
  <PageWrapper contentClass="flex" contentFullHeight fixedHeight dense class="bg-white m-3">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #actionbar-right>
        <BasicUpload
          :maxSize="20"
          :maxNumber="10"
          okText="确定"
          @change="handleChange"
          :api="uploadApi"
        />
      </template>
      <template #cell_originName="scope">
        <a-tooltip placement="topLeft" :title="scope.row.originName">
          {{ scope.row.originName }}
        </a-tooltip>
      </template>
      <template #cell_targetName="scope">
        <a-tooltip placement="topLeft" :title="scope.row.targetName">
          {{ scope.row.targetName }}
        </a-tooltip>
      </template>
      <template #cell_ip="scope">
        <a-tooltip placement="topLeft" :title="scope.row.ip">
          {{ scope.row.ip }}
        </a-tooltip>
      </template>
      <template #cell_location="scope">
        <a-tooltip placement="topLeft" :title="scope.row.location">
          {{ scope.row.location }}
        </a-tooltip>
      </template>
    </fs-crud>
  </PageWrapper>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import createCrudOptions from "./crud";
import { useExpose, useCrud } from "@fast-crud/fast-crud";
import { useMessage } from "/@/hooks/web/useMessage";
import { BasicUpload } from "/@/components/Upload";
import { uploadApi } from "/@/api/sys/upload";
import { PageWrapper } from "@/components/Page";

export default defineComponent({
  name: "FileForm",
  components: { PageWrapper, BasicUpload },
  setup() {
    const { notification } = useMessage();
    const crudRef = ref();
    const crudBinding = ref();
    const { expose } = useExpose({ crudRef, crudBinding });
    const { crudOptions } = createCrudOptions({ expose });
    useCrud({ expose, crudOptions });
    onMounted(() => {
      expose.doRefresh();
    });

    function handleChange() {
      notification.success({ message: "上传成功", duration: 2 });
      expose.doRefresh();
    }

    return {
      handleChange,
      uploadApi,
      crudBinding,
      crudRef,
    };
  },
});
</script>
