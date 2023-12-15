<template>
  <div class="sub-table">
    <div v-if="id > 0" style="height: 500px; position: relative">
      <fs-crud ref="crudRef" v-bind="crudBinding" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from "vue";
import createCrudOptions from "./crud";
import { useFs, useUi, utils } from "@fast-crud/fast-crud";

export default defineComponent({
  name: "DictItemTable",
  props: {
    /**
     * 主表id
     */
    id: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["save-main"],
  setup(props, ctx) {
    const parentIdRef = ref(props.id);
    const { crudBinding, crudRef, crudExpose } = useFs({
      createCrudOptions,
      context: { parentIdRef },
    });
    const { ui } = useUi();

    let formItemContext = ui.formItem.injectFormItemContext();

    function emit(data: any) {
      utils.logger.info("emit:", data);
      formItemContext.onBlur();
      formItemContext.onChange();
    }

    watch(
      () => {
        return props.id;
      },
      (value: any) => {
        if (value > 0) {
          crudExpose.setSearchFormData({
            form: { parentId: value },
            mergeForm: true,
            triggerSearch: true,
          });
          parentIdRef.value = value;
        }
      },
      {
        immediate: true,
      }
    );

    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
      watch(
        () => {
          return props.disabled || props.readonly;
        },
        (value) => {
          if (value) {
            crudBinding.value.table.editable.readonly = true;
            crudBinding.value.actionbar.buttons.addRow.show = false;
            crudBinding.value.rowHandle.show = false;
          } else {
            crudBinding.value.table.editable.readonly = false;
            crudBinding.value.actionbar.buttons.addRow.show = true;
            crudBinding.value.rowHandle.show = true;
          }
        },
        {
          immediate: true,
        }
      );
    });

    return {
      crudBinding,
      crudRef,
    };
  },
});
</script>
