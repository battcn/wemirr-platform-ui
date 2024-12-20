<script lang="ts">
import { defineComponent, ref, unref } from 'vue';

// import { BasicModal, useModalInner } from '#/components/Modal';
// import { BasicTable, useTable } from '#/components/Table';
// import { BasicTree, TreeActionType } from '#/components/Tree';

import { notification } from 'ant-design-vue';

import * as api from './api';
import { getBasicColumns } from './tableData';

export default defineComponent({
  name: 'DistributionUser',
  // components: { BasicModal, BasicTree, BasicTable },
  setup() {
    // const { notification } = useMessage();
    const tableButtons = ref();
    const resIdList = ref([...new Set()] as unknown as any[]);
    const modelRef = ref({});
    const permissionTreeRef = ref<>(null);
    const productRef = ref();
    const permissionTreeData = ref();
    const checkedKeys = ref();
    const dataSource = ref();

    // const [register, { closeModal }] = useModalInner(async (productId) => {
    //   checkedKeys.value = [];
    //   productRef.value = productId;
    //   await getMenuList().then((ret) => {
    //     permissionTreeData.value = ret;
    //     setTimeout(() => {
    //       getTree().filterByLevel(1);
    //     }, 0);
    //   });
    //   await api.GetPermissionResByProductId(productId).then((data) => {
    //     resIdList.value = data.resIdList;
    //     tableButtons.value = data.buttons;
    //     setSelectedRowKeys(resIdList.value);
    //     checkedKeys.value = data.buttons
    //       ?.filter((item) => !(item.type == 2))
    //       .filter((item) => data.resIdList.includes(item.id))
    //       .map((item) => item.id);
    //   });
    // });

    function handleSelect(checkedKeys, event) {
      if (!event.selected) {
        return;
      }
      const filterTable = tableButtons.value.filter(
        (item) => item.type === 2 && item.parentId === checkedKeys[0],
      );
      dataSource.value =
        filterTable && filterTable.length > 0 ? filterTable : [];
    }

    function onTreeNodeCheck(keys, event) {
      if (event.checked) {
        checkedKeys.value = [
          ...new Set(
            checkedKeys.value
              .filter((item: any) => item != event.node.eventKey)
              .concat(keys.checked),
          ),
        ];
      } else {
        setSelectedRowKeys([]);
        checkedKeys.value = checkedKeys.value.filter(
          (item) => item != event.node.eventKey,
        );
        const tableRowIds = new Set(getDataSource().map((item) => item.id));
        resIdList.value = resIdList.value.filter(
          (item) => item != event.node.eventKey && !tableRowIds.has(item),
        );
      }
    }
    async function handleSubmit() {
      const data = [...new Set(resIdList.value.concat(checkedKeys.value))];
      api
        .DistributionRoleAuthority({
          productId: productRef.value,
          resIdList: data,
        })
        .then(() => {
          notification.success({
            message: '权限分配成功',
            duration: 3,
          });
          // closeModal();
        });
    }
    // const [registerTable, { getDataSource, setSelectedRowKeys }] = useTable({
    //   canResize: false,
    //   size: 'small',
    //   showIndexColumn: false,
    //   dataSource,
    //   columns: getBasicColumns(),
    //   rowKey: 'id',
    //   showTableSetting: true,
    //   rowSelection: {
    //     type: 'checkbox',
    //   },
    //   onColumnsChange: (data) => {
    //     console.log('ColumnsChanged', data);
    //   },
    // });

    function onTableSelectChange({ keys, rows }) {
      // const tableRowIds = new Set(getDataSource().map((item) => item.id));
      // if (rows && rows.length > 0) {
      //   checkedKeys.value = checkedKeys.value.concat(
      //     ...new Set(rows.map((item) => item.parentId)),
      //   );
      //   resIdList.value = resIdList.value
      //     .filter((item) => !tableRowIds.has(item))
      //     .concat(keys);
      // } else {
      //   resIdList.value = resIdList.value.filter(
      //     (item) => !tableRowIds.has(item),
      //   );
      // }
      // resIdList.value = [...new Set(resIdList.value)];
      // checkedKeys.value = [...new Set(checkedKeys.value)];
    }

    function getTree() {
      const tree = unref(permissionTreeRef);
      if (!tree) {
        throw new Error('tree is null!');
      }
      return tree;
    }

    return {
      onTableSelectChange,
      permissionTreeRef,
      permissionTreeData,
      columns: getBasicColumns(),
      tableButtons,
      checkedKeys,
      onTreeNodeCheck,
      handleSelect,
      handleSubmit,
      // register,
      // closeModal,
      model: modelRef,
      // registerTable,
    };
  },
});
</script>

<template>
  <BasicModal
    v-bind="$attrs"
    title="分配权限"
    width="1000px"
    @ok="handleSubmit"
    @register="register"
  >
    <a-row class="row-res">
      <a-col :span="8">
        <BasicTree
          ref="permissionTreeRef"
          :checked-keys="checkedKeys"
          :field-names="{ key: 'id', title: 'name' }"
          :tree-data="permissionTreeData"
          check-strictly
          checkable
          search
          @check="onTreeNodeCheck"
          @select="handleSelect"
        />
      </a-col>
      <a-col :span="14">
        <BasicTable
          @register="registerTable"
          @selection-change="onTableSelectChange"
        />
      </a-col>
    </a-row>
  </BasicModal>
</template>

<style lang="less">
.row-res {
  min-height: 500px;
}
</style>
