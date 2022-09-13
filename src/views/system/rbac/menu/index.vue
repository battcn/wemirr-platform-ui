<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <SysList class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable
      @register="registerTable"
      class="w-3/4 xl:w-4/5"
      :searchInfo="searchInfo"
      @fetch-success="expandTableAll"
    >
      <template #menuType="{ record }">
        <a-tag :color="menuType[record.menuType].color">
          {{ menuType[record.menuType].text }}
        </a-tag>
      </template>
      <template #menuStatus="{ record }">
        <a-badge status="processing" v-if="record.menuStatus == 1" text="启用" />
        <a-badge status="default" v-else text="停用" />
      </template>
      <template #icon="{ record }">
        <a-avatar
          :size="20"
          :src="getPictureUrl(record.icon)"
          shape="square"
          v-if="record.icon && record.iconType == 1"
        />
        <Icon
          v-if="record.icon && record.iconType == 0"
          :icon="record.icon"
          :size="20"
          :class="`${prefixCls}-wrapper__icon mr-2`"
        />
      </template>
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'insert'"
          :disabled="!searchInfo.systemId"
          >新增</a-button
        >
        <a-button
          color="warning"
          preIcon="ant-design:cloud-upload-outlined"
          @click="handleImport"
          v-auth="'import'"
          >导入</a-button
        >
        <a-button
          color="success"
          preIcon="ant-design:cloud-download-outlined"
          @click="handleExport"
          v-auth="'export'"
          >导出</a-button
        >
      </template>
      <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              icon: 'ant-design:plus-square-outlined',
              tooltip: '添加下级',
              auth: 'add',
              ifShow: () => record.menuType != 2,
              onClick: handleChild.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑菜单',
              color: 'success',
              auth: 'update',
              onClick: handleEdit.bind(null, record),
            },
          ]"
          :dropDownActions="[
            {
              label: '查看',
              onClick: handleDetail.bind(null, record.menuId),
            },
            {
              label: '删除',
              auth: 'delete',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record.menuId),
              },
            },
            {
              label: record.menuStatus == 1 ? '禁用' : '启用',
              auth: 'resetPassword',
              onClick: handleDelete.bind(null, record.menuId),
            },
          ]"
        />
      </template>
    </BasicTable>
    <MenuModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive, nextTick } from 'vue';
  import Icon from '/@/components/Icon/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { getAttachmentUrl } from '/@/utils';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { selectPage, deleteById } from '/@/api/modules/system/rbac/rbacMenu';
  import { PageWrapper } from '/@/components/Page';
  import SysList from './SystemList.vue';

  import { useModal } from '/@/components/Modal';
  import MenuModal from './MenuModal.vue';

  import { columns, searchFormSchema } from './menu.data';

  const menuType = {
    0: {
      text: '目录',
      color: 'blue',
    },
    1: {
      text: '菜单',
      color: 'cyan',
    },
    2: {
      text: '按钮',
      color: 'green',
    },
  };
  const { prefixCls } = useDesign('menu-content');
  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload, updateTableDataRecord, expandAll }] = useTable({
    title: '菜单列表',
    api: selectPage,
    rowKey: 'menuId',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      alwaysShowLines: 1,
      autoAdvancedLine: 1,
    },
    useSearchForm: true,
    isTreeTable: true,
    bordered: true,
    canResize: true,
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    actionColumn: {
      width: 110,
      title: '操作',
      align: 'left',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });
  function handleCreate() {
    openModal(true, {
      isUpdate: false,
      systemId: searchInfo.systemId,
    });
  }
  function handleImport() {}
  function handleExport() {}
  function handleDetail(menuId: string) {
    console.log('-handleDetail----menuId------', menuId);
  }
  function expandTableAll() {
    nextTick(expandAll);
  }
  function handleEdit(record: any) {
    openModal(true, {
      isUpdate: true,
      systemId: record.systemId,
      menuId: record.menuId,
    });
  }
  function handleChild(record: any) {
    openModal(true, {
      isUpdate: false,
      systemId: record.systemId,
      parentId: record.menuId,
      parentType: record.menuType,
    });
  }
  function getPictureUrl(url: string) {
    return getAttachmentUrl(url);
  }
  async function handleDelete(menuId: string) {
    await deleteById(menuId);
    reload();
  }

  function handleSuccess({ isUpdate, values }) {
    if (isUpdate) {
      updateTableDataRecord(values.menuId, values);
    } else {
      reload();
    }
  }

  function handleSelect(systemId = '') {
    searchInfo.systemId = systemId;
    reload();
  }
</script>
