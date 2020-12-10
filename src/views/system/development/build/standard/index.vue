<template>
  <d2-container :class="{'page-compact':crud.pageOptions.compact}">
    <d2-crud-x
      ref="d2Crud"
      v-bind="_crudProps"
      v-on="_crudListeners"
      @log-track="logTrackHandler"
      @push-track="pushTrackHandler"
      :options="crud.options">
      <div slot="header">
        <el-form ref="form">
          <el-row v-for="(val, index) in dataItem" :key="index" style="margin-bottom: 10px;">
            <el-col :span="3">
              <el-select v-model="dataItem[index].column" placeholder="请选择" clearable>
                <el-option
                  v-for="item in crudOptions.columns"
                  :key="item.value"
                  :label="item.title"
                  :value="item.key"
                  :disabled="isSelected(item.key)">
                </el-option>
              </el-select>
            </el-col>
            <el-col style="width:180px;margin-left: 10px;">
              <dict-select clearable v-model="dataItem[index].expression" :disabled="dataItem[index].column === null"
                           :dict="getDict({
                  data: [
                    {'value':'eq',label:'包含（ = ）'},
                    {'value':'ne',label:'不等于（ <> ）'},
                    {'value':'gt',label:'大于（ > ）'},
                    {'value':'ge',label:'大于等于（ >= ）'},
                    {'value':'lt',label:'小于（ < ）'},
                    {'value':'le',label:'小于等于（ <= ）'},
                    {'value':'like',label:'包含（ like ）'},
                    {'value':'is_null',label:'为空（ is null ）'},
                    {'value':'is_not_null',label:'不为空（ is not null ）'},
                  ]
                  })" @change="change(dataItem[index])"/>
            </el-col>
            <el-col :span="4" style="margin-left: 10px;">
              <el-input clearable v-model="dataItem[index].value"
                        v-if="dataItem[index].show"
                        placeholder="请填写内容"/>
            </el-col>
            <el-button type="primary" icon="el-icon-plus" plain style="margin-left:10px;" circle @click="add"
                       v-if="index === 0"/>

            <el-button type="danger" icon="el-icon-delete" plain style="margin-left:10px;" circle v-if="index !== 0"
                       @click="remove(index)"/>
          </el-row>
        </el-form>
        <el-row>
          <el-button ref="search" size="small" type="primary" @click="doSearch"><i class="el-icon-search"></i>查询
          </el-button>
          <el-button size="small" type="primary" @click="addRow"><i class="el-icon-plus"></i> 新增</el-button>
          <el-button size="small" type="danger" @click="batchDelete"
                     :disabled="!multipleSelection || multipleSelection.length === 0"><i class="el-icon-delete"></i>
            批量删除
          </el-button>
        </el-row>

        <crud-toolbar
          :refresh="null" :search="null"
          :compact.sync="crud.pageOptions.compact"
          :columns="crud.columns"
          v-bind="_crudToolbarProps" v-on="_crudToolbarListeners"
          @columns-filter-changed="columnsFilterChanged"/>
      </div>
    </d2-crud-x>


    <el-dialog title="推送记录" :visible.sync="dialogLogTrackVisible">
      <el-timeline>
        <el-timeline-item v-for="item in logTrack"
                          :key="item.id"
                          icon="el-icon-position"
                          color="#0bbd87"
                          :timestamp="item.createdTime"
                          placement="top">
          <el-card>
            <json-viewer v-if="item.result" :value="JSON.parse(item.result)"
                         :copyable="copyable" sort
                         expanded
                         :expand-depth=0></json-viewer>
            <span style="font-size: 14px;font-family: Consolas, Menlo, Courier, monospace;">
              {{item.createdName}} 推送于 {{item.createdTime}} </span>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>


  </d2-container>
</template>

<script>
import Vue from 'vue'
import {d2CrudPlus} from 'd2-crud-plus'
import * as api from './api'
import JsonViewer from 'vue-json-viewer'

Vue.use(JsonViewer)
export default {
  name: 'developmentBuildStandard',
  mixins: [d2CrudPlus.crud],
  comments: {
    JsonViewer
  },
  watch: {
    $route: {
      handler(router) {
        this.getGridCode()
      },
      deep: true,
      immediate: true

    }
  },
  data() {
    return {
      dialogLogTrackVisible: false,
      copyable: {
        copyText: '复制',
        copiedText: '复制成功'
      },
      logTrack: [{
        id: '',
        createdName: '',
        createdTime: '',
        color: '#0bbd87',
        size: 'large',
        type: 'primary',
        icon: 'el-icon-more'
      }],
      dataItem: [
        {
          column: null,
          show: false,
          expression: null,
          value: null
        }
      ],
      options: [
        // {value: "name", label: "姓名"},
        // {value: "age", label: "年龄"},
        // {value: "sex", label: "性别"}
      ],
      crudOptions: {},
      getDict(dict) {
        return d2CrudPlus.util.dict.mergeDefault(dict)
      },
    }
  },
  methods: {
    logTrackHandler(event) {
      this.dialogLogTrackVisible = true
      api.LogTrack(this.model, event.row._id).then(res => {
        this.logTrack = res.data
      })
    },
    pushTrackHandler(event) {
      api.PushTrack(this.model, event.row._id).then(res => {
        this.$message({
          message: '推送成功',
          type: 'success'
        })
      })
    },
    columnsFilterChanged() {
      // console.log('this.crud.columns',this.crud.columns)
      // this.handleColumnsFilterChanged(this.crudOptions.columns)
    },
    change(row) {
      // if(row)
      // this.dataItem[index].show = true
      row.show = !(row.expression === 'is_null' || row.expression === 'is_not_null');
      console.log('change', row)
    },
    isSelected(key) {
      let is = false;
      for (let i = 0, j = this.dataItem.length; i < j; i++) {
        if (this.dataItem[i].column === key) {
          is = true;
        }
      }
      return is;
    },
    submit() {
      let query = {};
      for (let i = 0, j = this.dataItem.length; i < j; i++) {
        query[this.dataItem[i].column] = this.dataItem[i].value
      }
      console.log(query)
    },
    add() {
      this.dataItem.push({
        column: null,
        value: null,
        show: false
      });
    },
    remove(key) {
      this.dataItem.splice(key, 1);
      this.$message.success('移除成功')
    },
    doSearch() {
      let query = {};
      for (let i = 0, j = this.dataItem.length; i < j; i++) {
        query[this.dataItem[i].name] = this.dataItem[i].val
      }
      query.queries = this.dataItem
      this.handleSearch(query)
    },
    _OnCreated() {
      api.GetCrudOptions(this.gridCode).then(res => {
        this.crudOptions = res.data
        this._doStart()
      })
    },
    getCrudOptions() {
      return this.crudOptions
    },
    pageRequest(query) {
      return api.PageList(this.model, query)
    },
    addRequest(row) {
      return api.AddObj(this.model, row)
    },
    updateRequest(row) {
      return api.UpdateObj(this.model, row._id, row)
    },
    delRequest(row) {
      return api.DelObj(this.model, row._id)
    },
    batchDelRequest(ids) {
      return api.BatchDel(this.model, ids);
    },
    doServerExport(content) {
      console.log('doServerExport', content)
      api.Download(this.model, content).then(blob => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = (e) => {
          const a = document.createElement('a')
          a.download = this.$route.name + '.xlsx'
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })
    },
    getGridCode() {
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
    }
  }
}
</script>

<style>
.el-card__body {
  padding: 10px 20px 10px 20px;
}

.jv-container .jv-code {
  padding: 10px 20px 10px 0px;
}

.jv-container .jv-code.open {
  max-height: initial !important;
  overflow: visible;
  overflow-x: auto;
  padding-bottom: 10px;
}
</style>
