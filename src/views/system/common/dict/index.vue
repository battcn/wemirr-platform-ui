<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <DictList class="w-1/4 xl:w-3/8" @on-select="handleSelect" />
    <BasicTable
      @register="registerTable"
      class="w-3/4 xl:w-5/8"
      :searchInfo="searchInfo"
      @fetch-success="expandTableAll"
      @expanded-rows-change="expandedChange"
    >
      <template #itemStatus="{ record }">
        <a-badge status="processing" v-if="record.itemStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          :disabled="!searchInfo.dictId"
          >新增</a-button
        >
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看字典项',
              onClick: handleDetail.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑字典项',
              color: 'success',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除字典项',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.itemId),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <DictItemModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectItemPage, deleteItem } from '/@/api/modules/system/common/commonDict';
  import { PageWrapper } from '/@/components/Page';
  import DictList from './DictList.vue';
  import { useModal } from '/@/components/Modal';
  import DictItemModal from './DictItemModal.vue';
  import { columns, searchFormSchema } from './dict.data';
  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload, updateTableDataRecord, expandAll }] = useTable({
    title: '字典项列表',
    api: selectItemPage,
    rowKey: 'itemId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    indentSize: 10,
    showIndexColumn: false,
    bordered: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    actionColumn: {
      width: 110,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function expandedChange(record) {
    console.log('--------record-----------', record);
  }
  function handleCreate() {
    console.log('--------record-----------', 'oeuroweurower00000');
    openModal(true, {
      isUpdate: false,
      id: searchInfo.dictId,
    });
  }
  function handleSelect(dictId) {
    console.log('--------record-------dictId-11111---', dictId);
    searchInfo.dictId = dictId;
    reload();
  }
  function handleDetail(record) {
    console.log('-handleDetail----roleId------', record);
  }
  function expandTableAll() {
    nextTick(expandAll);
  }
  function handleEdit(record) {
    openModal(true, {
      isUpdate: true,
      record,
    });
  }
  async function handleDelete(itemId: string) {
    await deleteItem(itemId);
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
