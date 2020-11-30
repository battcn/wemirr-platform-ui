<template>
  <d2-container>
    <el-row :gutter="10">
      <el-col :sm="6" :xs="24">
        <el-card class="box-card">
          <div class="filter-container">
            <el-input size="small" placeholder="名称" style="width: 190px;" @keyup.enter.native="search"
                      class="filter-item search-item" clearable v-model="label"/>
            <el-tooltip class="item" content="新增/删除时，请先勾选菜单" effect="dark" placement="right" style="margin-left: 5px;">
              <el-dropdown size="small" split-button type="primary"> 更多
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="add">
                    <i class="el-icon-arrow-down el-icon-circle-plus-outline"></i> 添加
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="deleteMenu">
                    <i class="el-icon-arrow-down el-icon-remove-outline"></i> 删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-tooltip>
          </div>
          <common-tree :tree-data="menuTree" @nodeClick="nodeClick" ref="menuTree">
            <template slot-scope="treeNode">
              <span class="tree-icon">
                <i :class="treeNode.data.icon ? treeNode.data.icon : 'el-icon-document'"></i>
              </span>
              <span class="tree-icon">
                <el-badge :type="treeNode.data.locked ? 'danger' :'success'" class="status-item" is-dot/>
              </span>
            </template>
          </common-tree>
        </el-card>
      </el-col>

      <el-col :sm="8" :xs="24">
        <el-card class="box-card">
          <el-form :model="menu" :rules="rules" label-position="right" label-width="60px" ref="form" readonly>
            <el-form-item label="上级ID" prop="parentId">
              <el-tooltip content="值为0时表示顶节点" class="item" effect="dark" placement="right">
                <el-input readonly v-model="menu.parentId"/>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="名称" prop="label">
              <el-input v-model="menu.label"/>
            </el-form-item>
            <div v-if="menu.parentId !== 0">
              <el-form-item label="类型">
                <el-radio-group v-model="menu.type" size="medium" @change="changeType">
                  <el-radio-button label='1'>菜单</el-radio-button>
                  <el-radio-button label='3'>路由</el-radio-button>
                  <el-radio-button label='5'>一键发布</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <div v-if="menu.type != 5">
                <el-form-item label="路由" prop="path" >
                  <el-input @keyup.native="menuPath" v-model="menu.path"/>
                </el-form-item>
                <el-form-item label="组件" prop="component">
                  <el-input v-model="menu.component"/>
                  <span>{{ menuComponent }}</span>
                </el-form-item>
              </div>
              <div v-else>
                <el-form-item label="模板" prop="model" >
                <el-select v-model="menu.model" filterable clearable placeholder="请选择" >
                  <el-option
                    v-for="item in buildStandardList"
                    :key="item.model"
                    :label="item.label"
                    :value="item.model">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.model }}</span>
                  </el-option>
                </el-select>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="图标" prop="icon">
              <e-icon-picker v-model="menu.icon" :options="options" :disabled="disabled" :readonly="readonly"
                             :placement="placement" :styles="style" :width="width"/>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="状态" prop="locked">
                  <el-switch inactive-text="启用" active-text="禁用" v-model="menu.locked"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="公有" prop="global">
                  <el-switch active-text="是" inactive-text="否"
                             v-model="menu.global"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="排序" prop="sequence">
              <el-input-number :max="100" :min="0" @change="handleNumChange" v-model="menu.sequence"/>
            </el-form-item>
            <el-form-item label="描述" prop="description">
              <el-input v-model="menu.description" type="textarea"/>
            </el-form-item>
            <el-form-item>
              <el-button @click="submit" plain type="primary" style="float: right">{{ menu.id === '' ? '添加' : '编辑' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :sm="10" :xs="24">
        <el-card class="box-card">
          <d2-crud-x
            ref="d2Crud"
            v-bind="_crudProps"
            v-on="_crudListeners"
            :options="crud.options">
            <div slot="header">
              <el-button-group>
                <el-button size="small" type="primary" @click="addRow"><i class="el-icon-plus"></i> 新增</el-button>
              </el-button-group>
              <crud-toolbar
                            :columns="crud.columns"
                            @refresh="doRefresh()"
                            @columns-filter-changed="handleColumnsFilterChanged"/>
            </div>
          </d2-crud-x>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>
<script>

import commonTree from '@/components/wemirr/tree/index.vue'
import * as api from './api'
import { crudOptions } from './crud'
import { d2CrudPlus } from 'd2-crud-plus'

export default {
  name: 'MenuManage',
  mixins: [d2CrudPlus.crud],
  components: { commonTree },
  data () {
    return {
      buildStandardList: [],
      value: '',
      icon: '',
      options: { FontAwesome: false, ElementUI: true, addIconList: [], removeIconList: [] },
      disabled: false,
      readonly: false,
      placement: 'bottom',
      style: {},
      width: 800,
      dialog: {
        isVisible: false,
        type: 'add'
      },
      preview: {
        isVisible: false,
        context: ''
      },
      iconVisible: false,
      menuTree: [],
      label: '',
      menu: this.initMenu(),
      menuId: null,
      resourceTableKey: 0,
      resourceLoading: false,
      resourceSelection: [],
      resourceTableData: {
        total: 0
      },
      rules: {
        label: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 1, max: 255, message: '2到10个字符', trigger: 'blur' }
        ],
        model: [
          { required: true, message: '模板不能为空' }
        ],
        path: [{ max: 255, message: '不能超过100', trigger: 'blur' },
          { required: true, message: '不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const isUrl = this.isUrl(this.menu.path)

              if (value === '/' || (!isUrl && value.endsWith('/'))) {
                // callback('请填写有效的路由地址')
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }]
      }
    }
  },
  computed: {
    menuComponent () {
      let comp = ''
      if (this.menu.path && this.menu.path !== '/') {
        const isUrl = this.isUrl(this.menu.path)
        if (isUrl) {
          comp = `跳转地址：${this.menu.path}`
        } else {
          // comp = `前端组件：src/views/zuihou${this.menu.path}/Index.vue`
          comp = `组件路径：src/views/${this.menu.component}.vue`
        }
      } else {
        comp = '组件路径：src/views/wemirr/index.vue'
      }
      return comp
    }
  },
  watch: {
    'menu.path': function () {
      this.computedComponent()
    }
  },
  mounted () {
    this.initMenuTree()
    this.initBuildStandardList()
  },
  methods: {
    initBuildStandardList () {
      api.GetBuildStandardList({ size: 9999 }).then(res => {
        console.log('res', res)
        this.buildStandardList = res.data.records
      })
    },
    getCrudOptions () {
      return crudOptions(this)
    },
    /**
     * 第一次请求页面数据
     * initColumns初始化完成后调用
     * 可以用一个空方法覆盖它，阻止初始化后请求数据
     */
    doLoad () {
      // return this.doRefresh({ from: 'load' })
    },
    /**
     * 主动查询
     * form = 查询参数
     */
    doSearch (form) {
      if (this.menuId) {
        this.handleSearch(form)
      } else {
        this.$message({
          message: '请选择菜单后在查询',
          type: 'warning'
        })
      }
    },
    pageRequest (query) {
      query.parentId = this.menuId
      query.type = 2
      query.size = 99999
      return api.GetResourceList(query)
    },
    /**
       * 添加数据提交前可以进行修改
       * @param row
       */
    doDialogOpened (context) {
      context.form.parentId = this.menuId
    },
    addRequest (row) {
      console.log('menuId', this.menuId)
      return api.AddResourceObj(row)
    },
    updateRequest (row) {
      return api.UpdateResourceObj(row)
    },
    delRequest (row) {
      return api.DelResourceById(row.id)
    },
    isUrl (path) {
      const urls = ['http://', '/http://', 'https://', '/https://', 'www.', '/www.']
      const urlIndex = urls.findIndex(item => {
        return path.startsWith(item)
      })
      return urlIndex >= 0
    },
    menuPath () {
      const isUrl = this.isUrl(this.menu.path)
      if (!isUrl && !this.menu.path.startsWith('/')) {
        this.menu.path = '/' + this.menu.path
      } else if (isUrl) {
        if (this.menu.path.startsWith('/')) {
          this.menu.path = this.menu.path.substr(1)
        }
      }
    },
    computedComponent () {
      const isUrl = this.isUrl(this.menu.path)
      if (isUrl) {
        this.menu.component = 'Layout'
      } else if (this.menu.id === '') {
        if (this.menu.path) {
          this.menu.component = `wemirr${this.menu.path}/index`
        } else {
          this.menu.component = 'wemirr/index'
        }
      }
    },
    initMenuTree () {
      api.GetRouter().then((res) => {
        this.menuTree = res.data
      })
    },
    initMenu () {
      return {
        id: '',
        label: '',
        type: 1,
        description: '',
        code: '',
        model: '',
        global: false,
        path: '',
        component: '',
        locked: true,
        sequence: 0,
        parentId: 0,
        icon: '',
        group: ''
      }
    },
    nodeClick (data) {
      this.menu = { ...data }
      this.$refs.form.clearValidate()
      this.menuId = data.id
      this.doSearch({ menuId: data.id })
    },
    handleNumChange (val) {
      this.menu.sortValue = val
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.menu.createTime = this.menu.updateTime = null
          if (this.menu.id) {
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
      api.AddObj(this.menu)
        .then((res) => {
          if (res.successful) {
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          }
          this.reset()
        })
    },
    update () {
      api.UpdateObj(this.menu)
        .then((res) => {
          if (res.successful) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }
          this.reset()
        })
    },
    reset () {
      this.initMenuTree()
      this.label = ''
      this.resetForm()
    },
    search () {
      this.$refs.menuTree.$refs.treeRef.filter(this.label)
    },
    add () {
      this.resetForm()
      const checked = this.$refs.menuTree.$refs.treeRef.getCheckedKeys()
      if (checked.length > 1) {
        this.$message({
          message: '只能选择一条',
          type: 'warning'
        })
      } else if (checked.length > 0) {
        this.menu.parentId = checked[0]
      } else {
        this.menu.parentId = 0
      }
      this.menuId = null
    },
    deleteMenu () {
      const checked = this.$refs.menuTree.$refs.treeRef.getCheckedKeys()
      if (checked.length === 0) {
        this.$message({
          message: '未选择节点',
          type: 'warning'
        })
      } else if (checked.length !== 1) {
        this.$message({
          message: '只能选择一个菜单',
          type: 'warning'
        })
      } else {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.DelObj(checked[0])
            .then((res) => {
              if (res.successful) {
                this.$message({
                  message: '删除成功',
                  type: 'success'
                })
              }
              this.reset()
              this.menuId = null
            })
        }).catch(() => {
          this.$refs.menuTree.$refs.treeRef.setCheckedKeys([])
        })
      }
    },
    resetForm () {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.menu = this.initMenu()
    },
    changeType (row) {
      console.log('changeType', this.menu.type, this.menu.type !== 5)
    }
  }
}
</script>
