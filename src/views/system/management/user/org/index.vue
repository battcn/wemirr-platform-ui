<template>
  <d2-container>
    <el-row :gutter="10">
      <el-col :sm="12" :xs="24">
        <el-card class="box-card">
          <div class="grid-content bg-purple">
            <el-input size="small" style="width: 250px;margin-right: 8px;margin-bottom: 8px;" placeholder="请输入地区名称"
                      class="filter-item search-item" v-model="label"/>
            <el-button-group>
              <el-button size="small" type="primary" @click="search"><i class="el-icon-search"></i>搜索</el-button>
              <el-button size="small" style="margin-left: 8px;" type="warning" @click="reset"><i class="el-icon-refresh"></i> 重置</el-button>
            </el-button-group>
            <!--@node-click="nodeClick"-->
            <el-tree
              style="margin-top: 10px; font-size: large"
              :check-strictly="true"
              :data="orgTree"
              :default-expand-all="true"
              :filter-node-method="filterNode"
              highlight-current
              node-key="id"
              ref="orgTree"
              show-checkbox>
           <span class="custom-tree-node" slot-scope="{ node }">
        <span>{{ node.label }}</span>
        <span>
          <i class="el-icon-plus" @click="appendNode(node)"></i>
          <i class="el-icon-edit" @click="nodeClick(node.data)"></i>
          <i class="el-icon-delete" @click="removeNode(node)"></i>
        </span>
           </span>
            </el-tree>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="12" :xs="24">
        <el-card class="box-card">
          <div class="grid-content bg-purple-light">
            <div class="clearfix" slot="header">
              <span>{{org.id ? "编辑": "新增"}}</span>
            </div>
            <el-form :model="org" :rules="rules" label-position="right" label-width="100px" ref="form">
              <el-form-item label="父ID" prop="parentId">
                <el-tooltip content="值为0时表示顶节点" class="item" effect="dark" placement="top-start">
                  <el-input readonly v-model="org.parentId"/>
                </el-tooltip>
              </el-form-item>
              <el-form-item label="部门名称" prop="label">
                <el-input v-model="org.label"/>
              </el-form-item>
              <el-form-item label="简称" prop="abbreviation">
                <el-input v-model="org.abbreviation"/>
              </el-form-item>
              <el-form-item label="描述" prop="describe">
                <el-input v-model="org.description"/>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="org.status">
                  <el-radio-button :label="true">启用</el-radio-button>
                  <el-radio-button :label="false">禁用</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="排序" prop="sequence">
                <el-input-number :max="100" :min="0" @change="handleNumChange" v-model="org.sequence"/>
              </el-form-item>
              <el-form-item>
                <el-button @click="submit" plain type="primary" style="float: right">{{org.id ? "编辑" : "新增" }}</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>
<script>
import * as api from './api'

export default {
  name: 'OrgResource',
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
      label: '',
      orgTree: [],
      org: this.initOrg(),
      dicts: { AREA_LEVEL: ['省', '市', '区', '镇'] },
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
    this.initOrgTree()
  },
  methods: {
    initOrg () {
      return {
        id: null,
        parentLabel: '',
        abbreviation: '',
        label: '',
        parentId: 0,
        status: true,
        description: '',
        sequence: 0
      }
    },

    removeNode (node) {
      const that = this
      this.$confirm(
        '选中节点及其子结点将被永久删除, 是否继续？',
        '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        api.DelObj(node.data.id)
          .then(res => {
            that.reset()
          })
      }).catch((err) => {
        console.log('err', err)
      })
    },
    initOrgTree (parentId = 0) {
      api.GetList({ parentId: parentId }).then(res => {
        this.orgTree = res.data
      })
    },
    handleNumChange (val) {
      this.org.sequence = val
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    appendNode (node) {
      this.resetForm()
      this.org.parentId = node.data.id
      this.org.parentLabel = node.data.label
    },
    nodeClick (data) {
      this.org = { ...data }
      const parent = this.$refs.orgTree.getNode(data.parentId)
      if (parent) {
        this.org.parentLabel = parent.label
      }
      this.$refs.form.clearValidate()
    },
    search () {
      this.$refs.orgTree.filter(this.label)
    },
    reset () {
      this.initOrgTree()
      this.label = ''
      this.resetForm()
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.org.id) {
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
      api.AddObj({ ...this.org }).then(res => {
        this.reset()
      })
    },
    update () {
      api.UpdateObj({ ...this.org }).then(res => {
        this.reset()
      })
    },
    resetForm () {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.org = this.initOrg()
    }
  }
}
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
