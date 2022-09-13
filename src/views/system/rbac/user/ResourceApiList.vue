<template>
  <BasicTable
    @register="registerTable"
    :rowSelection="{ type: 'checkbox' }"
    :row-selection="{
      selectedRowKeys: data.keys,
      onSelect: handleSelect,
      onSelectAll: handleSelectAll,
      type: 'checkbox',
    }"
    :searchInfo="searchInfo"
  />
</template>
<script lang="ts" setup>
  import { reactive, watch, nextTick } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { selectResourcePage } from '/@/api/modules/system/rbac/rbacOrg';
  import { RbacResourceDto } from '/@/api/modules/system/rbac/model/rbacResourceModel';
  import { columns, searchFormSchema } from './resourceapi.data';
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const params = reactive(route.query as any);
  const searchInfo = reactive<Recordable>({ authType: 1, orgId: params.orgId });
  const props = defineProps({
    resource: {
      type: Object as PropType<RbacResourceDto>,
      default: () => {},
    },
    value: {
      type: Object as PropType<string[]>,
      default: () => [] as string[],
    },
    selectApiInfos: {
      type: Object as PropType<any[]>,
      default: () => [] as any[],
    },
  });
  const emit = defineEmits(['change', 'checked']);
  const [registerTable, { reload }] = useTable({
    api: selectResourcePage,
    rowKey: 'apiId',
    columns,
    formConfig: {
      labelWidth: 70,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    indentSize: 10,
    showIndexColumn: false,
    bordered: true,
    showTableSetting: false,
  });
  const data = reactive({
    keys: [] as string[],
    selectRows: [] as any[],
  });
  watch(
    () => props.resource,
    () => {
      searchInfo.resourceId = props.resource?.resourceId || '';
      nextTick(() => {
        reload();
      });
    },
    { immediate: true },
  );
  watch(
    () => props.value,
    () => {
      data.keys = props.value;
      data.selectRows = props.selectApiInfos;
    },
    { immediate: true },
  );
  function handleSelect(record, selected) {
    if (selected) {
      data.keys.push(record.apiId);
      data.selectRows.push(record);
    } else {
      let findIndex = data.selectRows.findIndex((val) => val.apiId == record.apiId);
      if (findIndex != -1) {
        data.selectRows.splice(findIndex, 1);
      }
      findIndex = data.keys.findIndex((val) => val == record.apiId);
      if (findIndex != -1) {
        data.keys.splice(findIndex, 1);
      }
    }
    emit('change', { selectedRows: data.selectRows, selectedRowKeys: data.keys });
  }
  function handleSelectAll(selected, __selectedRows, changeRows) {
    if (selected) {
      changeRows.forEach((item) => {
        data.keys.push(item.apiId);
        data.selectRows.push(item);
      });
    } else {
      changeRows.forEach((item) => {
        let findIndex = data.selectRows.findIndex((val) => val.apiId == item.apiId);
        if (findIndex != -1) {
          data.selectRows.splice(findIndex, 1);
        }
        findIndex = data.keys.findIndex((val) => val == item.apiId);
        if (findIndex != -1) {
          data.keys.splice(findIndex, 1);
        }
      });
    }
    emit('change', { selectedRows: data.selectRows, selectedRowKeys: data.keys });
  }
</script>

<style lang="less">
  .vben-basic-table-form-container {
    padding: 0px 16px 0px 16px;

    & > .ant-form {
      padding: 0px !important;
    }
  }
</style>
