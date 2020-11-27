<template>
    <d2-crud-x
      ref="d2Crud"
      v-bind="_crudProps"
      v-on="_crudListeners"
      :options="options"
    >
      <div slot="header">
        <crud-search ref="search" :options="crud.searchOptions" @submit="doSearch"  />
        <el-button-group>
          <el-button size="small" type="primary" @click="addRow"><i class="el-icon-plus"/> 新增</el-button>
        </el-button-group>
        <crud-toolbar :search.sync="crud.searchOptions.show"
                      :columns="crud.columns"
                      @refresh="doRefresh()"
                      storage="dictionaryTable"
                      @current-change="handleCurrentChange"
                      @columns-filter-changed="handleColumnsFilterChanged"/>

      </div>
    </d2-crud-x>
</template>

<script>
import * as api from './api'
import { crudOptions } from './crud'
import { d2CrudPlus } from 'd2-crud-plus'

export default {
  name: 'formSelect',
  mixins: [d2CrudPlus.crud],
  data () {
    return {
      options: {
        border: true,
        stripe: true
      }
    }
  },
  methods: {
    handleCurrentChange (currentRow, oldCurrentRow) {
      // this.$emit('dictionaryClick', 'hi')
      // this.$store.commit('system/dictionary', currentRow)
      // this.$emit('dictionaryClick', currentRow)
      // this.$refs.dictionaryItem.dictionaryClick(currentRow)
      this.$emit('dictionaryClick', currentRow)
    },
    getCrudOptions () {
      return crudOptions(this)
    },
    pageRequest (query) {
      return api.GetList(query)
    },
    addRequest (row) {
      return api.AddObj(row)
    },
    updateRequest (row) {
      return api.UpdateObj(row)
    },
    delRequest (row) {
      return api.DelObj(row.id)
    }
  }
}
</script>
