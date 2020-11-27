<template>
  <d2-container>
    <d2-crud-x
        ref="d2Crud"
        v-bind="_crudProps"
        v-on="_crudListeners"
        :options="crud.options"
        @config="configHandler"
        @grid="gridHandler"
        @table-view="tableViewHandler"
    >
      <div slot="header">
        <crud-search ref="search" :options="crud.searchOptions" @submit="doSearch"  />
        <el-button-group>
          <el-button size="small" type="primary" @click="addRow"><i class="el-icon-plus"></i> 新增</el-button>
        </el-button-group>
        <crud-toolbar :search.sync="crud.searchOptions.show"
                      :columns="crud.columns"
                      @refresh="doRefresh()"
                      @columns-filter-changed="handleColumnsFilterChanged"/>
      </div>
      <div slot="tableViewFormSlot" slot-scope="scope">
        <sub-table :value="scope.form"  @selected="nestIdSelected($event,scope.form)"></sub-table>
      </div>
    </d2-crud-x>

    <grid-config
      :dialog-visible="gridConfigDialog.isVisible"
      @close="gridConfigDialog.isVisible = false"
      @success="successHandler"
      ref="gridConfig"/>

  </d2-container>
</template>

<script>
import * as api from './api'
import { crudOptions } from './crud'
import { d2CrudPlus } from 'd2-crud-plus'
import subTable from './subTable'

import GridConfig from './config/index'
export default {
  name: 'formSelect',
  mixins: [d2CrudPlus.crud],
  components: { GridConfig, subTable },
  data () {
    return {
      gridConfigDialog: {
        isVisible: false
      }
    }
  },
  methods: {
    nestIdSelected (value, form) {
      // console.log('nestIdSelected', value, form)
      // this.$emit('selected', value)
      // form.nestId = value.id
      // this.currentNestName = value.name
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
    },
    successHandler () {
      // this.doSearch()
    },
    configHandler (event) {
      console.log('event', event)
      this.gridConfigDialog.isVisible = true
      this.$refs.gridConfig.init(event.row)
    },
    gridHandler (event) {
      console.log('event', event)
    },
    tableViewHandler (event) {
      console.log('event', event)
    }
  }
}
</script>
