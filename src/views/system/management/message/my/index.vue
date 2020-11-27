<template>
  <d2-container  :class="{'page-compact':crud.pageOptions.compact}">
    <d2-crud-x
        ref="d2Crud"
        v-bind="_crudProps"
        v-on="_crudListeners"
        :options="options"
    >
      <div slot="header">
        <crud-search ref="search" :options="crud.searchOptions" @submit="doSearch"  />
        <crud-toolbar :search.sync="crud.searchOptions.show"
                      :compact.sync="crud.pageOptions.compact"
                      :columns="crud.columns"
                      @refresh="doRefresh()"
                      @columns-filter-changed="handleColumnsFilterChanged"/>

      </div>
    </d2-crud-x>

  </d2-container>
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
    getCrudOptions () {
      return crudOptions(this)
    },
    pageRequest (query) {
      return api.GetMyMessageList(query)
    },
    delRequest (row) {
      return api.DelObj(row.id)
    }
  }
}
</script>
