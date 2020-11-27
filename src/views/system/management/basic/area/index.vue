<template>
  <d2-container  :class="{'page-compact':crud.pageOptions.compact}">
    <d2-crud-x
      ref="d2Crud"
      v-bind="_crudProps"
      v-on="_crudListeners"
      @add="addChildren"
      :options="crud.options"
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
    </d2-crud-x>
      <!--<el-row :gutter="10">
        <el-col :sm="12" :xs="24">
          <el-input size="small" style="width: 250px;margin-right: 8px;" placeholder="请输入地区名称" class="filter-item search-item" v-model="name"/>
          <el-button-group>
            <el-button size="small" type="primary" @click="search"><i class="el-icon-search"></i>搜索</el-button>
            <el-button size="small" style="margin-left: 8px;" type="warning" @click="reset"><i class="el-icon-refresh"></i> 重置</el-button>
            <el-button size="small" style="margin-left: 8px;" type="primary" @click="add"><i class="el-icon-plus"></i> 新增</el-button>
            <el-button size="small" style="margin-left: 8px;" type="danger" @click="del"><i class="el-icon-delete"></i> 删除</el-button>
          </el-button-group>
          <el-tree
            style="margin-top: 10px;"
            :check-strictly="true"
            :data="areaTree"
            :filter-node-method="filterNode"
            @node-click="nodeClick"
            :load="loadTree"
            highlight-current
            node-key="id"
            ref="areaTree"
            :lazy="true"
            show-checkbox/>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-card class="box-card">
            <div class="clearfix" slot="header">
            <span>{{area.id ? "编辑": "新增"}}</span>
            </div>
            <div>
              <el-form
                :model="area"
                :rules="rules"
                label-position="right"
                label-width="100px"
                ref="form">
                <el-form-item
                  :hidden="true"
                  label="父ID"
                  prop="parentId">
                  <el-tooltip
                    content="上级ID"
                    class="item"
                    effect="dark"
                    placement="top-start">
                    <el-input readonly v-model="area.parentId"/>
                  </el-tooltip>
                </el-form-item>
                <el-form-item
                  label="父ID" prop="parentLabel">
                  <el-input readonly disabled="disabled" v-model="area.parentLabel"/>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                  <el-input v-model="area.name"/>
                </el-form-item>
                <el-form-item label="国标码" prop="code">
                  <el-input v-model="area.code"/>
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                  <el-input v-model="area.longitude"/>
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                  <el-input v-model="area.latitude"/>
                </el-form-item>
                <el-form-item label="来源" prop="source">
                  <el-input v-model="area.source"/>
                </el-form-item>
                <el-form-item label="级别" prop="level">
                  <el-select v-model="area.level" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="sortValue">
                  <el-input-number :max="100" :min="0" @change="handleNumChange" v-model="area.sequence"/>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
          <el-card class="box-card" style="margin-top: -2rem;">
            <el-row>
              <el-col :span="24" style="text-align: right">
                <el-button @click="submit" plain type="primary">{{area.id ? "编辑" : "新增" }}
                </el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>-->
  </d2-container>
</template>
<script>
import * as api from './api'
import { crudOptions } from './crud'
import { d2CrudPlus } from 'd2-crud-plus'

export default {
  name: 'AreaResource',
  mixins: [d2CrudPlus.crud],
  data () {
    return {
      options: [{
        value: '1',
        label: '省'
      }, {
        value: '2',
        label: '市'
      }, {
        value: '3',
        label: '区'
      }, {
        value: '4',
        label: '镇'
      }, {
        value: '5',
        label: '街道'
      }],
      name: '',
      areaTree: [],
      dicts: { AREA_LEVEL: ['省', '市', '区', '镇'] },
      area: this.initArea(),
      rules: {
        label: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 255,
            message: '长度不能超过 255 个字符',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '编码不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    // initDicts('AREA_LEVEL', this.dicts)
  },
  created () {
    console.log(this.area.level)
  },
  methods: {
    initArea () {
      return {
        id: null,
        code: null,
        name: '',
        parentId: 0,
        parentLabel: '',
        longitude: '',
        latitude: '',
        source: '',
        level: 0,
        sequence: 0
      }
    },
    addChildren (event) {
      console.log('event,', event)
      this.getD2Crud().showDialog({
        addData: {
          parentId: event.row.id,
          parentLabel: event.row.name
        },
        mode: 'add', // 当前打开模式,可选项[add,edit,view]
        rowIndex: 0, // 编辑或查看时，哪一行的数据
        template: null // 表单模版
      })
    },
    getCrudOptions () {
      return crudOptions(this)
    },
    pageRequest (query) {
      return api.GetList(query)
    },
    addRequest (row) {
      return api.AddObj(row).then(ret => {
        // 手动更新加载项
        const data = this.getD2Crud().$refs.elTable.store.states.treeData
        if (data != null) {
          const item = data[row.parentId]
          if (item != null) {
            item.loaded = false
            item.expanded = false
          }
        }
        return ret
      })
    },
    updateRequest (row) {
      return api.UpdateObj(row)
    },
    delRequest (row) {
      return api.DelObj(row.id).then(ret => {
        // 手动更新加载项
        const data = this.getD2Crud().$refs.elTable.store.states.treeData
        if (data != null) {
          const item = data[row.parentId]
          if (item != null) {
            item.loaded = false
            item.expanded = false
          }
        }
        return ret
      })
      // return api.DelObj(row.id)
    },
    initAreaTree (parentId = 0) {
      api.GetList({ parentId: parentId }).then(data => {
        this.areaTree = data
      })
    },
    loadTree (node, resolve) {
      api.GetList({ parentId: node.data.id }).then(data => {
        resolve(data)
      })
    },
    handleNumChange (val) {
      this.area.sortValue = val
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    nodeClick (data) {
      this.area = { ...data }
      this.area.code = data.id
      const parent = this.$refs.areaTree.getNode(data.parentId)
      if (parent) {
        this.area.parentLabel = parent.label
      }

      this.$refs.form.clearValidate()
    },
    add () {
      this.resetForm()
      const checked = this.$refs.areaTree.getCheckedNodes()
      if (checked.length > 1) {
        this.$message({
          message: this.$t('tips.onlyChooseOne'),
          type: 'warning'
        })
      } else if (checked.length > 0) {
        this.area.parentId = checked[0].id
        this.area.parentLabel = checked[0].label
      } else {
        this.area.parentId = 0
        this.area.parentLabel = ''
      }
    },
    del () {
      const that = this
      const checked = this.$refs.areaTree.getCheckedKeys()
      if (checked.length === 0) {
        this.$message({
          message: '请先选择节点',
          type: 'warning'
        })
      } else {
        this.$confirm(
          '选中节点及其子结点将被永久删除, 是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          api.DelObj(checked[0])
            .then(res => {
              that.reset()
            })
        })
      }
    },
    search () {
      this.$refs.areaTree.filter(this.label)
    },
    reset () {
      this.initAreaTree()
      this.label = ''
      this.resetForm()
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.area.id) {
            this.update()
          } else {
            this.save()
          }
        } else {
          return false
        }
      })
    },
    save () {
      api.AddObj({ ...this.area }).then(res => {
        this.reset()
      })
    },
    update () {
      api.UpdateObj({ ...this.area }).then(res => {
        this.reset()
      })
    },
    resetForm () {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.area = this.initArea()
    }
  }
}
</script>
