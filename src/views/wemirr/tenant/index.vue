<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #cell_name="scope">
      <a-tooltip placement="top" :title="scope.row.name">
        {{ scope.row.name }}
      </a-tooltip>
    </template>
  </fs-crud>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import _ from 'lodash-es';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';

  function useCustomForm(expose, crudBinding) {
    const openCustomForm = () => {
      const baseFormOptions = _.omit(crudBinding?.value.form, ['columns']);
      const formOptions = _.merge(_.cloneDeep(baseFormOptions), {
        wrapper: { title: '自定义表单' },
        columns: {
          customField: {
            title: '新表单字段',
            component: {
              name: 'a-input',
              vModel: 'value',
              allowClear: true,
            },
          },
        },
        doSubmit({ form }) {
          console.log('form submit:', form);
          message.info('自定义表单提交:' + JSON.stringify(form));
          message.warn('抛出异常可以阻止表单关闭');
          throw new Error('抛出异常可以阻止表单关闭');
        },
      });
      expose.getFormWrapperRef().open(formOptions);
    };
    return { openCustomForm };
  }

  export default defineComponent({
    name: 'TenantForm',
    setup() {
      const crudRef = ref();
      const crudBinding = ref();
      const areaTree = ref([]);
      const { expose } = useExpose({ crudRef, crudBinding });
      const customForm = useCustomForm(expose, crudBinding);
      const { crudOptions } = createCrudOptions({ expose, customForm });
      useCrud({ expose, crudOptions });

      onMounted(() => {
        expose.doRefresh();
      });

      const filter = (inputValue, path) => {
        return path.some(
          (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
        );
      };
      return {
        filter,
        areaTree,
        crudBinding,
        crudRef,
      };
    },
  });
</script>
