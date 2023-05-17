<template>
  <PageWrapper contentClass="flex" contentFullHeight fixedHeight class="bg-white m-4 mr-4">
    <Card :bordered="false" class="w-1/3 xl:w-1/4">
      <BasicTree
        search
        checkStrictly
        @check="onTreeNodeCheck"
        :clickRowToExpand="false"
        ref="terrDataRef"
        :treeData="terrData"
        :fieldNames="{ key: 'id', title: 'name' }"
        @select="handleSelect"
      />
    </Card>
    <Card title="组织管理" class="w-full menu">
      <fs-crud ref="crudRef" v-bind="crudBinding" />
    </Card>
  </PageWrapper>
</template>

<script>
import { defineComponent, ref, onMounted, unref } from 'vue'
import createCrudOptions from './crud'
import { useExpose, useCrud } from '@fast-crud/fast-crud'
import { BasicTree } from '@/components/Tree'
import { PageWrapper } from '@/components/Page'
import { getOrgList } from '@/api/sys/org'
import { Card } from 'ant-design-vue'
export default defineComponent({
  name: 'StationForm',
  components: {Card, BasicTree, PageWrapper },
  setup() {
    const terrDataRef = ref({})
    const terrData = ref()
    const nodeRef = ref()

    const crudRef = ref()
    const crudBinding = ref()
    const { expose } = useExpose({ crudRef, crudBinding })
    const { crudOptions } = createCrudOptions({ expose, nodeRef })
    useCrud({ expose, crudOptions, permission: 'station:management' })

    // 页面打开后获取列表数据
    onMounted(() => {
      getOrgList()
      expose.doRefresh()
    })

    getOrgList().then((ret) => {
      terrData.value = ret
      setTimeout(() => {
        getTree().filterByLevel(2)
      }, 0)
    })
    function handleSelect(checkedKeys, event) {
      if (!event.selected) {
        return
      }
      nodeRef.value = event.selectedNodes[0]
      expose.doRefresh()
    }
    function onTreeNodeCheck(keys, event) {
      console.log('keys event', keys, event)
      if (!event.checked) {
      } else {
      }
    }
    function getTree() {
      const tree = unref(terrDataRef)
      if (!tree) {
        throw new Error('tree is null!')
      }
      return tree
    }
    return {
      terrDataRef,
      terrData,
      crudBinding,
      crudRef,
      handleSelect,
      onTreeNodeCheck
    }
  }
})
</script>

<style lang="less">
.station {
  margin-left: 10px;
  min-height: 1020px;
  .footer {
    .fs-crud-footer {
      padding: 20px 0;
    }
  }
  .fs-toolbar {
    margin-right: 10px;
  }
  .ant-card-body {
    margin-top: -12px;
  }
}
</style>
