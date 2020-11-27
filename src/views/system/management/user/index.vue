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
    <el-button-group>
        <el-button size="small" type="primary" @click="addRow"><i class="el-icon-plus"></i> 新增</el-button>
</el-button-group>
<crud-toolbar :search.sync="crud.searchOptions.show"
:compact.sync="crud.pageOptions.compact"
:columns="crud.columns"
@refresh="doRefresh()"
@columns-filter-changed="handleColumnsFilterChanged"/>

</div>
<template slot="expandSlot" slot-scope="scope">
    <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="名称">
            <span>{{ scope.row.nickName }}</span>
        </el-form-item>
        <el-form-item label="生日">
            <span>{{ scope.row.birthday }}</span>
        </el-form-item>
        <el-form-item label="描述">
            <span>{{ scope.row.description }}</span>
        </el-form-item>
    </el-form>
</template>
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
<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 60%;
  }
</style>
