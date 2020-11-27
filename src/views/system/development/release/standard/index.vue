<template>
  <d2-container  :class="{'page-compact':crud.pageOptions.compact}">
    <d2-crud-x
      ref="d2Crud"
      v-bind="_crudProps"
      v-on="_crudListeners"
      :options="crud.options"
    >
      <div slot="header">
        <crud-search ref="search" :options="crud.searchOptions" @submit="doSearch"  />
        <el-button-group>
          <el-button size="small" type="primary" @click="addRow"><i class="el-icon-plus"></i> 新增</el-button>
        </el-button-group>
        <crud-toolbar :search.sync="crud.searchOptions.show"
                      :compact.sync="crud.pageOptions.compact"
                      @refresh="doRefresh()"
                      @columns-filter-changed="handleColumnsFilterChanged"/>

      </div>
    </d2-crud-x>

  </d2-container>
</template>

<script>
import { d2CrudPlus } from 'd2-crud-plus'
import * as api from './api'
export default {
  name: 'aa',
  mixins: [d2CrudPlus.crud],
  watch: {
    $route: {
      handler (router) {
        this.getGridCode()
      },
      deep: true,
      immediate: true

    }
  },
  data () {
    return {
      title: '',
      model: '',
      crudOptions: {}
    }
  },
  methods: {
    _OnCreated () {
      api.GetCrudOptions(this.gridCode).then(res => {
        this.crudOptions = res.data
        this._doStart()
      })
    },
    getCrudOptions () {
      return this.crudOptions
    },
    pageRequest (query) {
      return api.PageList(this.model, query)
    },
    addRequest (row) {
      return api.AddObj(this.model, row)
    },
    updateRequest (row) {
      return api.UpdateObj(this.model, row.id, row)
    },
    delRequest (row) {
      return api.DelObj(this.model, row.id)
    },
    getGridCode () {
      const route = this.$route
      // console.log('route', route)
      let gridCode = null
      if (route.query && route.query.gridCode) {
        gridCode = route.query.gridCode
      } else {
        const str = route.path.split('/')
        if (str.length > 1) {
          gridCode = str[str.length - 1]
        }
      }
      this.gridCode = gridCode
      this.model = gridCode
      // const header = cloneDeep(this.header)
    }
  }
}
</script>
