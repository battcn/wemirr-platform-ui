<template>
  <div>
    <BasicTable
      @register="registerTable"
      @expand="handleExpandedChange"
      :row-selection="{
        selectedRowKeys: data.keys,
        onSelect: handleSelect,
        onSelectAll: handleSelectAll,
        type: 'checkbox',
      }"
    >
      <template #roleStatus="{ record }">
        <a-badge status="processing" v-if="record.roleStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <!-- <template #expandedRowRender="{ record }">
        <div style="text-align: center">
          <a-spin :spinning="data.meauActions[record.orgRoleId]?.loading" />
        </div>
        <template v-if="!data.meauActions[record.orgRoleId]?.loading">
          <a-empty
            v-if="
              !data.meauActions[record.orgRoleId]?.data ||
              data.meauActions[record.orgRoleId]?.data.length < 1
            "
          />
          <a-row :gutter="24" :style="{ marginBottom: '12px' }" v-else>
            <a-col
              :span="12"
              v-for="(permission, index) in data.meauActions[record.orgRoleId].data"
              :key="index"
              :style="{ marginBottom: '12px' }"
            >
              <a-col :span="4">
                <span>{{ permission.metaTitle }}：</span>
              </a-col>
              <a-col :span="20" v-if="permission.actionSet && permission.actionSet.length > 0">
                <a-tag
                  color="green"
                  v-for="(action, k) in permission.actionSet"
                  :key="k"
                  style="margin-left: 4px; margin-bottom: 4px"
                  >{{ action.metaTitle }}</a-tag
                >
              </a-col>
              <a-col :span="20" v-else>-</a-col>
            </a-col>
          </a-row>
        </template>
      </template> -->
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, watch } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { selectPage, getMenuActionById } from '/@/api/modules/system/rbac/rbacOrgRole';
  import { columns, searchFormSchema } from './orgRole.data';
  const props = defineProps({
    value: {
      type: Object as PropType<string[]>,
      default: () => [] as string[],
    },
    selectRoleInfos: {
      type: Object as PropType<any[]>,
      default: () => [] as any[],
    },
  });
  const emit = defineEmits(['change', 'checked']);
  const [registerTable] = useTable({
    title: '角色列表',
    api: selectPage,
    rowKey: 'orgRoleId',
    columns,
    formConfig: {
      labelWidth: 80,
      schemas: searchFormSchema,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    bordered: true,
    showTableSetting: false,
    expandRowByClick: true,
  });
  const data = reactive({
    meauActions: {},
    keys: [] as string[],
    selectRows: [] as any[],
  });
  async function handleExpandedChange(expanded, record) {
    data.meauActions[record.orgRoleId] = {
      data: [],
      loading: true,
    };
    if (expanded) {
      try {
        data.meauActions[record.orgRoleId].data = await getMenuActionById(record.orgRoleId);
      } finally {
        data.meauActions[record.orgRoleId].loading = false;
      }
    }
  }
  watch(
    () => props.value,
    () => {
      data.keys = props.value;
      data.selectRows = props.selectRoleInfos;
    },
    { immediate: true },
  );
  function handleSelect(record, selected) {
    if (selected) {
      data.keys.push(record.orgRoleId);
      data.selectRows.push(record);
    } else {
      let findIndex = data.selectRows.findIndex((val) => val.orgRoleId == record.orgRoleId);
      if (findIndex != -1) {
        data.selectRows.splice(findIndex, 1);
      }
      findIndex = data.keys.findIndex((val) => val == record.orgRoleId);
      if (findIndex != -1) {
        data.keys.splice(findIndex, 1);
      }
    }
    emit('change', { selectedRows: data.selectRows, selectedRowKeys: data.keys });
  }
  function handleSelectAll(selected, __selectedRows, changeRows) {
    if (selected) {
      changeRows.forEach((item) => {
        data.keys.push(item.orgRoleId);
        data.selectRows.push(item);
      });
    } else {
      changeRows.forEach((item) => {
        let findIndex = data.selectRows.findIndex((val) => val.orgRoleId == item.orgRoleId);
        if (findIndex != -1) {
          data.selectRows.splice(findIndex, 1);
        }
        findIndex = data.keys.findIndex((val) => val == item.orgRoleId);
        if (findIndex != -1) {
          data.keys.splice(findIndex, 1);
        }
      });
    }
    emit('change', { selectedRows: data.selectRows, selectedRowKeys: data.keys });
  }
</script>
