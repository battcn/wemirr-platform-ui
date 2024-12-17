<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';

import { compute, useFs, useUi } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';

export default defineComponent({
  name: 'ReceiptItemPage',
  props: {
    modelValue: {
      type: Array,
      default() {
        return undefined;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: compute(({ mode }) => {
        return mode;
      }),
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions });
    const { ui } = useUi();
    const formItemContext = ui.formItem.injectFormItemContext();

    function emit(data: any) {
      ctx.emit('update:modelValue', data);
      formItemContext.onBlur();
      formItemContext.onChange();
    }

    // 页面打开后获取列表数据
    onMounted(() => {
      watch(
        () => {
          return props.modelValue;
        },
        (value: any) => {
          if (value == null) {
            crudBinding.value.data = [];
            emit(crudBinding.value.data);
          } else {
            crudBinding.value.data = value;
          }
        },
        {
          immediate: true,
        },
      );
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
            crudBinding.value.actionbar.buttons.addRow.show = false;
            crudBinding.value.rowHandle.show = false;
          }
        },
        {
          immediate: true,
        },
      );
    });

    async function validate() {
      // 校验，在上级表单的beforeSubmit中调用
      return await crudExpose.getTableRef().editable.validate();
    }
    return {
      crudBinding,
      crudRef,
      validate,
    };
  },
});
</script>

<template>
  <div style="height: 500px; position: relative">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </div>
</template>
