<template>
  <div class="m-4 mr-0 overflow-hidden bg-white">
    <BasicTable @register="registerDictTable" @selection-change="selectionChange">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          value="small"
          >新增</a-button
        >
        <a-button
          color="warning"
          preIcon="ant-design:cloud-upload-outlined"
          @click="handleImport"
          value="small"
          >导入</a-button
        >
        <a-button
          color="success"
          preIcon="ant-design:cloud-download-outlined"
          @click="handleExport"
          value="small"
          >导出</a-button
        >
      </template>
      <template #dictAction="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看字典',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑字典',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除字典',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.dictId),
              },
            },
          ]"
        />
      </template>
      <template #dictStatus="{ record }">
        <a-badge status="processing" v-if="record.dictStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #dictType="{ record }">
        <a-tag :color="dictType[record.dictType].color">
          {{ dictType[record.dictType].text }}
        </a-tag>
      </template>
    </BasicTable>
    <DictModal @register="registerModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import DictModal from './DictModal.vue';
  import { selectPage, deleteById } from '/@/api/modules/system/common/commonDict';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn, TableAction } from '/@/components/Table';
  const columns: BasicColumn[] = [
    {
      title: '字典名称',
      dataIndex: 'dictName',
      width: 100,
    },
    {
      title: '字典编码',
      dataIndex: 'dictCode',
      align: 'center',
      width: 100,
    },
    {
      title: '类型',
      dataIndex: 'dictType',
      slots: { customRender: 'dictType' },
      width: 60,
    },
    {
      title: '状态',
      slots: { customRender: 'dictStatus' },
      dataIndex: 'dictStatus',
      width: 75,
    },
  ];
  const dictType = {
    0: {
      text: '字符',
      color: 'blue',
    },
    1: {
      text: '数字',
      color: 'cyan',
    },
    2: {
      text: '布尔',
      color: 'green',
    },
  };
  const [registerDictTable, { reload, updateTableDataRecord }] = useTable({
    api: selectPage,
    title: '字典列表',
    rowKey: 'dictId',
    showIndexColumn: false,
    columns,
    useSearchForm: false,
    rowSelection: { type: 'radio' },
    showTableSetting: false,
    bordered: true,
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      fixed: undefined,
      slots: { customRender: 'dictAction' },
    },
  });
  const emit = defineEmits(['onSelect']);
  const [registerModal, { openModal }] = useModal();
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }
  function handleImport() {}
  function handleExport() {}
  function handleView(record) {
    console.log('------record---', record);
  }
  function selectionChange(record) {
    let dictId = '';
    if (record.keys && Object.keys(record.keys).length > 0) {
      dictId = record.keys[0];
    }
    emit('onSelect', dictId);
  }
  function handleEdit(record) {
    openModal(true, {
      isUpdate: true,
      record,
    });
  }
  async function handleDelete(dictId: string) {
    await deleteById(dictId);
    reload();
  }
  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }
</script>
