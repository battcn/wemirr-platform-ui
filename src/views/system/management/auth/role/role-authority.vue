<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="title"
    :visible.sync="isVisible"
    :width="width"
    top="50px"
  >
    <el-form
      :model="roleAuthority"
      :rules="rules"
      label-position="top"
      label-width="100px"
      ref="form"
    >
        <el-row :gutter="12">
          <el-col :span="8">
            <el-card class="box-card">
              <el-form-item label="菜单" prop="menuIdList">
                <div align="left" style="margin-left:24px;">
                  <el-checkbox :indeterminate="isIndeterminate" @change="checkedAll" v-model="checkedMenu"/>
                  全选/反选
                </div>
                <el-tree
                  :check-strictly="true"
                  :data="menuTree"
                  :default-checked-keys="roleAuthority.menuIdList"
                  :default-expanded-keys="roleAuthority.menuIdList"
                  :disabled="disabled"
                  :expand-on-click-node="false"
                  @check="checkMenu"
                  @node-click="nodeClick"
                  default-expand-all
                  highlight-current
                  node-key="id"
                  ref="menuTree"
                  show-checkbox
                />
              </el-form-item>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-card class="box-card">
              <el-form-item label="资源" prop="resourceIdList">
                <el-table
                  :data="tableData.records"
                  :key="tableKey"
                  @select="onSelect"
                  @select-all="onAllSelect"
                  border
                  fit
                  ref="table"
                  row-key="id"
                  style="width: 100%;"
                  v-loading="loading"
                >
                  <el-table-column :reserve-selection="true" align="center" type="selection" width="40px"/>
                  <el-table-column label="资源码" :show-overflow-tooltip="true" align="center" prop="permission">
                    <template slot-scope="scope">
                      <span>{{ scope.row.permission }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="名称" :show-overflow-tooltip="true" align="center" prop="name">
                    <template slot-scope="scope">
                      <span>{{ scope.row.label }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-card>
          </el-col>
        </el-row>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">取消</el-button>
      <el-button :disabled="disabled" @click="submitForm" plain type="primary">确认</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { GetRouter, GetResourceList } from '@/views/system/management/auth/menu/api.js'
import * as api from './api.js'

export default {
  name: 'RoleAuthorityEdit',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // isVisible: true,
      roleAuthority: this.initRoleAuthority(),
      screenWidth: 0,
      width: this.initWidth(),
      menuTree: [],
      resourceList: [],
      // 回显的数据
      echoResourceIdList: [],
      rules: {},
      tableKey: 0,
      loading: false,
      tableData: {
        records: [],
        total: 0
      },
      selection: [],
      disabled: false,
      isIndeterminate: false,
      checkedMenu: false
    }
  },
  computed: {
    isVisible: {
      get () {
        return this.dialogVisible
      },
      set () {
        this.reset()
        this.tableData.records = []
        this.tableData.total = 0
        this.close()
      }
    },
    title () {
      return '配置菜单资源'
    }
  },
  watch: {},
  mounted () {
    this.initMenuTree()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    allMenuIdList () {
      const menuIdList = []
      this.getMenuIdList(this.menuTree, menuIdList)
      return menuIdList
    },
    getMenuIdList (menuList, menuIdList) {
      if (menuList) {
        menuList.forEach(item => {
          menuIdList.push(item.id)
          if (item.children && item.children.length > 0) {
            this.getMenuIdList(item.children, menuIdList)
          }
        })
      }
    },
    checkedAll () {
      if (this.checkedMenu) {
        // 全选
        this.$refs.menuTree.setCheckedKeys(this.allMenuIdList())
        this.isIndeterminate = false
      } else {
        // 取消选中
        this.$refs.menuTree.setCheckedKeys([])
        this.isIndeterminate = false
      }
    },
    nodeClick (data) {
      const vm = this
      vm.loading = true
      GetResourceList({ parentId: data.id, type: 2 })
        .then(res => {
          vm.tableData = res.data
          vm.loading = false
          vm.displayTable()
        })
    },
    displayTable () {
      const vm = this
      vm.tableData.records.forEach(item => {
        console.log('vm.roleAuthority', vm.roleAuthority)
        vm.roleAuthority.resourceIdList.forEach(resourceId => {
          if (item.id === resourceId) {
            console.log('===item===', item)
            vm.$refs.table.toggleRowSelection(item, true)
          }
        })
      })
    },
    onAllSelect (selection) {
      this.onSelect(selection)
    },
    onSelect (selection, row) {
      this.mergeResourceIdList(selection, row)
      // this.roleAuthority.resourceIdList = selection.map(item => item.id);
      this.selection = selection

      // 根据右侧选中的资源，强制勾选左侧的 树状层级菜单
      const old = this.$refs.menuTree.getCheckedKeys()
      const must = selection.map(item => item.menuId)
      const newSelected = Array.from(new Set([...old, ...must]))
      this.$refs.menuTree.setCheckedKeys(newSelected)
      newSelected.forEach(item => {
        this.selectedParent(item)
      })
    },
    mergeResourceIdList (selection, row) {
      // true就是选中，0或者false是取消选中
      let selected = true
      if (row) {
        selected = selection.length && selection.indexOf(row) !== -1
      } else {
        selected = selection.length > 0
      }

      // 本次选中的
      const curResourceIdList = selection.map(item => item.id)

      const ridList = this.echoResourceIdList
      if (!selected && row) {
        const index = ridList.findIndex(item => {
          if (item === row.id) {
            return true
          }
        })
        ridList.splice(index, 1)
      }

      // 本次选中的 + 回显的 然后去重
      // this.roleAuthority.resourceIdList = [
      //   ...new Set([...curResourceIdList, ...ridList])
      // ]
      this.roleAuthority.resourceIdList = [
        ...new Set([...curResourceIdList])
      ]
    },

    initMenuTree () {
      GetRouter().then(res => {
        this.menuTree = res.data
      })
    },
    initRoleAuthority () {
      return {
        roleId: '',
        menuIdList: [],
        resourceIdList: []
      }
    },
    initWidth () {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '55%'
      } else {
        return '1000px'
      }
    },
    setRoleAuthority (val) {
      const vm = this
      vm.roleAuthority.roleId = val.id
      // 回显
      api.GetInfo(val.id).then(res => {
        vm.roleAuthority.menuIdList = res.data.authority.menuIdList
        vm.roleAuthority.resourceIdList = res.data.authority.resourceIdList
        vm.echoResourceIdList = res.data.authority.resourceIdList
        vm.$refs.menuTree.setCheckedKeys(res.data.authority.menuIdList)
        res.data.authority.menuIdList.forEach(item => {
          vm.selectedParent(item)
        })
      })
    },
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.roleAuthority = this.initRoleAuthority()
      this.$refs.menuTree.setCheckedKeys([])
      this.$refs.table.clearSelection()
    },
    submitForm () {
      const vm = this
      this.$refs.form.validate(valid => {
        if (valid) {
          vm.editSubmit()
        } else {
          return false
        }
      })
    },
    editSubmit () {
      const vm = this
      this.roleAuthority.menuIdList = vm.$refs.menuTree
        .getHalfCheckedKeys()
        .concat(vm.$refs.menuTree.getCheckedKeys())
      // 勾选时， 实时计算出来
      // this.roleAuthority.resourceIdList = vm.selection.map(item => item.id);
      api.AddRoleAuthority(this.roleAuthority).then(res => {
        if (res.successful) {
          vm.isVisible = false
          vm.$message({
            message: '创建成功',
            type: 'success'
          })
          vm.$emit('success')
        }
      })
    },
    checkMenu (data, node) {
      if (node.checkedKeys.length === 0) {
        // 取消
        this.checkedMenu = false
        this.isIndeterminate = false
      } else if (node.checkedKeys.length === this.allMenuIdList().length) {
        // 全选
        this.checkedMenu = true
        this.isIndeterminate = false
      } else {
        // 中立
        this.checkedMenu = false
        this.isIndeterminate = true
      }

      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = node.checkedKeys.indexOf(data.id) // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(data)
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(data, true)
      } else {
        // 未选中 处理子节点全部未选中
        if (data.children && data.children.length !== 0) {
          this.uniteChildSame(data, false)
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame (data, isSelected) {
      this.$refs.menuTree.setChecked(data.id, isSelected)
      if (data.children) {
        for (let i = 0; i < data.children.length; i++) {
          this.uniteChildSame(data.children[i], isSelected)
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent (data) {
      const currentNode = this.$refs.menuTree.getNode(data)
      if (currentNode.parent.key !== undefined) {
        this.$refs.menuTree.setChecked(currentNode.parent, true)
        this.selectedParent(currentNode.parent)
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
