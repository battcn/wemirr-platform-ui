<template>
  <BasicModal v-bind="$attrs" @register="register" title="分配权限" width="1000px" @ok="handleSubmit">
    <a-row class="row-res">
      <a-col :span="8">
        <BasicTree
          search
          checkable
          :checkedKeys="checkedKeys"
          checkStrictly
          @check="onTreeNodeCheck"
          ref="permissionTreeRef"
          :treeData="permissionTreeData"
          :fieldNames="{ key: 'id', title: 'name' }"
          @select="handleSelect"
        />
      </a-col>
      <a-col :span="14">
        <BasicTable @register="registerTable" @selection-change="onTableSelectChange" />
      </a-col>
    </a-row>
  </BasicModal>
</template>

<script lang="ts">
import { defineComponent, ref, unref } from 'vue'
import { BasicTree, TreeActionType } from '@/components/Tree'
import { BasicModal, useModalInner } from '@/components/Modal'
import { getMenuList, GetPermissionList } from '@/api/sys/menu'
import { BasicTable, useTable } from '@/components/Table'
import { getBasicColumns } from './tableData'
import { useMessage } from '@/hooks/web/useMessage'

import * as api from './api'
export default defineComponent({
  name: 'DistributionUser',
  components: { BasicModal, BasicTree, BasicTable },
  setup() {
    const { notification } = useMessage()
    const tableButtons = ref()
    const resIdList = ref([...new Set()] as unknown as any[])
    const modelRef = ref({})
    const permissionTreeRef = ref<Nullable<TreeActionType>>(null)
    const roleIdRef = ref()
    const permissionTreeData = ref()
    const checkedKeys = ref()
    const dataSource = ref()

    const [register, { closeModal }] = useModalInner(async (roleId) => {
      checkedKeys.value = []
      roleIdRef.value = roleId
      await getMenuList().then((ret) => {
        permissionTreeData.value = ret
        setTimeout(() => {
          getTree().filterByLevel(1)
        }, 0)
      })
      await GetPermissionList(roleId).then((data) => {
        resIdList.value = data.resIdList
        tableButtons.value = data.buttons
        setSelectedRowKeys(resIdList.value)
        checkedKeys.value = data.buttons
          ?.filter((item) => !(item.type == 2))
          .filter((item) => data.resIdList.includes(item.id))
          .map((item) => item.id)
      })
    })

    function handleSelect(checkedKeys, event) {
      if (!event.selected) {
        return
      }
      let filterTable = tableButtons.value.filter((item) => item.type === 2 && item.parentId === checkedKeys[0])
      if (filterTable && filterTable.length > 0) {
        dataSource.value = filterTable
      } else {
        dataSource.value = []
      }
    }

    function onTreeNodeCheck(keys, event) {
      if (!event.checked) {
        setSelectedRowKeys([])
        checkedKeys.value = checkedKeys.value.filter((item) => item != event.node.eventKey)
        const tableRowIds = getDataSource().map((item) => item.id)
        resIdList.value = resIdList.value.filter((item) => item != event.node.eventKey && !tableRowIds.includes(item))
      } else {
        checkedKeys.value = [...new Set(checkedKeys.value.filter((item) => item != event.node.eventKey).concat(keys.checked))]
      }
    }
    async function handleSubmit() {
      const data = [...new Set(resIdList.value.concat(checkedKeys.value))]
      api.DistributionRoleAuthority({ roleId: roleIdRef.value, resIds: data }).then(() => {
        notification.success({
          message: '权限分配成功',
          duration: 3
        })
        closeModal()
      })
    }
    const [registerTable, { getDataSource, getSelectRows, setSelectedRowKeys }] = useTable({
      canResize: false,
      size: 'small',
      showIndexColumn: false,
      dataSource: dataSource,
      columns: getBasicColumns(),
      rowKey: 'id',
      showTableSetting: true,
      rowSelection: {
        type: 'checkbox'
      },
      onColumnsChange: (data) => {
        console.log('ColumnsChanged', data)
      }
    })

    function onTableSelectChange({ keys, rows }) {
      const tableRowIds = getDataSource().map((item) => item.id)
      if (rows && rows.length > 0) {
        checkedKeys.value = checkedKeys.value.concat(...new Set(rows.map((item) => item.parentId)))
        resIdList.value = resIdList.value.filter((item) => !tableRowIds.includes(item)).concat(keys)
      } else {
        resIdList.value = resIdList.value.filter((item) => !tableRowIds.includes(item))
      }
      resIdList.value = [...new Set(resIdList.value)]
      checkedKeys.value = [...new Set(checkedKeys.value)]
    }

    function getTree() {
      const tree = unref(permissionTreeRef)
      if (!tree) {
        throw new Error('tree is null!')
      }
      return tree
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
      register,
      closeModal,
      model: modelRef,
      registerTable
    }
  }
})
</script>

<style lang="less">
.row-res {
  min-height: 500px;
}
</style>
