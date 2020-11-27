<template>
  <d2-crud-x
    ref="d2Crud"
    v-bind="_crudProps"
    v-on="_crudListeners"
    :options="options"
  >
    <div slot="header">
      <crud-search ref="search" :options="crud.searchOptions" @submit="doSearch"/>
      <el-button-group>
        <el-button size="small" type="primary" @click="addRow"><i class="el-icon-plus"/> 新增</el-button>
      </el-button-group>
      <crud-toolbar :search.sync="crud.searchOptions.show"
                    :columns="crud.columns"
                    @refresh="doRefresh()"
                    storage="dictionaryItemTable"
                    @current-change="handleCurrentChange"
                    @columns-filter-changed="handleColumnsFilterChanged"/>

    </div>
  </d2-crud-x>
</template>

<script>
import * as api from './api'
import { crudItemOptions } from './crud'
import { d2CrudPlus } from 'd2-crud-plus'

export default {
  name: 'formSelect',
  mixins: [d2CrudPlus.crud],
  data () {
    return {
      dictionaryId: 0,
      options: {
        border: true,
        stripe: true
      }
    }
  },
  computed: {
    // 废弃方法
    fetchData () {
      const that = this
      const dictionaryInfo = this.$store.getters['system/getDictionary'].dictionaryInfo
      if (dictionaryInfo !== undefined && dictionaryInfo !== null && dictionaryInfo.id !== that.dictionaryId) {
        that.dictionaryId = dictionaryInfo.id
        this.doSearch({ id: dictionaryInfo.id })
      }
      return 1
    }
  },
  methods: {
    getCrudOptions () {
      return crudItemOptions(this)
    },
    dictionaryClick (row) {
      this.dictionaryId = row.id
      this.doSearch({ id: row.id })
    },
    /**
       * 第一次请求页面数据
       * initColumns初始化完成后调用
       * 可以用一个空方法覆盖它，阻止初始化后请求数据
       */
    doLoad () {
      // return this.doRefresh({ from: 'load' })
    },
    pageRequest (query) {
      const id = this.dictionaryId
      if (id) {
        query.id = id
      }
      return api.GetItemList(query)
    },
    addRequest (row) {
      return api.AddItemObj(this.dictionaryId, row)
    },
    updateRequest (row) {
      return api.UpdateItemObj(this.dictionaryId, row)
    },
    delRequest (row) {
      return api.DelItemObj(this.dictionaryId, row.id)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
