<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';

import { compute, useFs, useUi } from '@fast-crud/fast-crud';

import createCrudOptions from './crud';

export default defineComponent({
  name: 'ReceivingPlanItemPage',
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
    const isShowLine = ref(false);
    const { crudBinding, crudRef, crudExpose, context } = useFs({
      createCrudOptions,
    });
    context.isShowLine = isShowLine;
    // context.isShow = isShow;
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
          if (value === null) {
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
            isShowLine.value = true;
          } else {
            crudBinding.value.table.editable.readonly = false;
            crudBinding.value.actionbar.buttons.addRow.show = true;
            crudBinding.value.rowHandle.show = true;
            isShowLine.value = false;
          }
        },
        {
          immediate: true,
        },
      );
      // watch(
      //   () => {
      //     return props.mode;
      //   },
      //   (value) => {
      //     isShowLine.value = value !== "add";
      //   },
      //   {
      //     immediate: true,
      //   },
      // );
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
  <div style=" position: relative;height: 500px">
    <fs-crud ref="crudRef" v-bind="crudBinding" />
  </div>
</template>
