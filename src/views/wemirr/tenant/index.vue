<template>
  <fs-crud ref="crudRef" v-bind="crudBinding">
    <template #cell_name="scope">
      <a-tooltip placement="top" :title="scope.row.name">
        {{ scope.row.name }}
      </a-tooltip>
    </template>
    <fs-form-wrapper ref="formWrapperRef" v-bind="formWrapperOptions" />
  </fs-crud>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue';
  import createCrudOptions from './crud';
  import { useExpose, useCrud } from '@fast-crud/fast-crud';
  import { GET, PUT } from '/src/api/service';
  import { useMessage } from '/@/hooks/web/useMessage';

  function useFormWrapper(wrapperRow, activeDataSourceList) {
    const { notification } = useMessage();
    const formWrapperRef = ref();
    console.log('activeDataSourceList', activeDataSourceList);

    const formWrapperOptions = ref({
      labelPosition: 'right',
      labelWidth: '80px',
      col: {
        span: 12,
      },
      labelAlign: 'right',
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
      wrapper: {
        is: 'a-modal',
        width: '960px',
        destroyOnClose: true,
        footer: null,
        title: '租户配置',
      },
      display: 'flex',
      columns: {
        dynamicDatasourceId: {
          title: '数据源',
          helper: '暂时没想到有太好的UI实现，先简单点来吧',
          component: {
            name: 'a-select',
            vModel: 'value',
            showSearch: true,
            allowClear: true,
            placeholder: '请输入搜索内容',
            options: activeDataSourceList,
          },
          rules: [{ required: true, message: '请选择数据源' }],
        },
      },
      doSubmit({ form }) {
        PUT(`/authority/tenants/${wrapperRow.value.id}/config`, form)
          .then(() => {
            notification.success({ message: '租户配置成功', duration: 2 });
          })
          .catch((e) => {
            throw new Error(e);
          });
      },
    });
    function openFormWrapper() {
      formWrapperRef.value.open(formWrapperOptions.value);
    }
    return {
      formWrapperRef,
      openFormWrapper,
      formWrapperOptions,
    };
  }

  export default defineComponent({
    name: 'TenantForm',
    setup() {
      const crudRef = ref();
      const crudBinding = ref();
      const areaTree = ref([]);
      const wrapperRow = ref({});
      const activeDataSourceList = ref([]);
      const formWrapper = useFormWrapper(wrapperRow, activeDataSourceList);
      const { expose } = useExpose({ crudRef, crudBinding });
      const { crudOptions } = createCrudOptions({ expose, wrapperRow, formWrapper });
      useCrud({ expose, crudOptions });

      onMounted(() => {
        GET('/authority/databases/active').then((ret) => {
          activeDataSourceList.value = ret.data.map((item) => {
            return { value: item.id, label: item.poolName };
          });
        });
        expose.doRefresh();
      });

      const filter = (inputValue, path) => {
        return path.some(
          (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
        );
      };
      return {
        filter,
        ...formWrapper,
        areaTree,
        crudBinding,
        crudRef,
      };
    },
  });
</script>
