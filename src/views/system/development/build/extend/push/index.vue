<template>
  <d2-container :class="{'page-compact':crud.pageOptions.compact}">
    <d2-crud-x
      ref="d2Crud"
      v-bind="_crudProps"
      v-on="_crudListeners"
      @config="configHandler"
      :options="options"
    >
      <div slot="header">
        <crud-search ref="search" :options="crud.searchOptions" @submit="doSearch"/>
        <el-button-group>
          <el-button size="small" type="primary" @click="addRow"><i class="el-icon-plus"></i> 新增</el-button>
        </el-button-group>
        <crud-toolbar :search.sync="crud.searchOptions.show"
                      :compact.sync="crud.pageOptions.compact"
                      :columns="crud.columns"
                      @refresh="doRefresh()"
                      @columns-filter-changed="handleColumnsFilterChanged"/>
      </div>
    </d2-crud-x>

    <el-dialog title="授予角色" :visible.sync="dialogPermissionVisible">

      <el-checkbox-group v-model="checkedModels">
        <el-checkbox class="d2-mb-10" v-for="option in modelList" :key="option.id" :label="option.id">
          {{ option.label }}
        </el-checkbox>
      </el-checkbox-group>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary" @click="bindBuildModel(pushId)">确定
        </el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>
import * as api from './api'
import {crudOptions} from './crud'
import {d2CrudPlus} from 'd2-crud-plus'

export default {
  name: 'developmentBuildIndex',
  mixins: [d2CrudPlus.crud],
  data() {
    return {
      modelList: [],
      checkedModels: [],
      pushId: undefined,
      dialogPermissionVisible: false,
      options: {
        border: true,
        stripe: true
      }
    }
  },
  methods: {
    getCrudOptions() {
      return crudOptions(this)
    },
    pageRequest(query) {
      return api.GetList(query)
    },
    addRequest(row) {
      return api.AddObj(row)
    },
    updateRequest(row) {
      return api.UpdateObj(row)
    },
    delRequest(row) {
      return api.DelObj(row.id)
    },
    bindBuildModel(pushId) {
      console.log(pushId)
      api.BindBuildModel(pushId, {ids: this.checkedModels}).then(ret => {
        this.dialogPermissionVisible = falseRightPanel
        this.doRefresh()
      })
    },
    configHandler(event) {
      api.GetDragList({size: 9999}).then(ret => {
        let models = event.row.models
        if (models == null) {
          models = []
        }
        const checkedModels = ret.data.records.map(item => item.id).filter(item => models.indexOf(item) >= 0)
        this.$set(this, 'checkedModels', checkedModels)
        this.$set(this, 'modelList', ret.data.records)
        this.pushId = event.row.id
        this.dialogPermissionVisible = true
      })
    }
  }
}
</script>
