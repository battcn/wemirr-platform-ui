<template>
  <el-dialog :close-on-click-modal="false" :title="title" :type="type" :visible.sync="isVisible" :width="width" top="50px">
    <el-form :model="role" :rules="rules" label-position="right" label-width="100px" ref="form">
      <el-form-item label="编码" prop="code">
        <el-input :disabled="type==='edit'" v-model="role.code"/>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="role.name"/>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="role.locked">
          <el-radio-button :label="false">启用</el-radio-button>
          <el-radio-button :label="true">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="role.description" type="textarea"/>
      </el-form-item>
      <el-form-item label="数据范围" prop="scopeType">
        <el-radio-group @change="dsTypeChange" v-model="role.scopeType">
          <el-radio-button :key="index" :label="key" :value="key" v-for="(item, key, index) in enums.DataScopeType">
            {{ item }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item :hidden="orgHidden" label="组织" prop="orgList">
        <el-tree
          :data="orgList"
          :default-checked-keys="role.orgList"
          :default-expanded-keys="role.orgList"
          highlight-current
          node-key="id"
          ref="orgTree"
          show-checkbox
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">取消</el-button>
      <el-button @click="submitForm" plain type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import * as api from './api'
import { GetList as OrgTree } from '@/views/system/management/user/org/api.js'

export default {
  name: 'RoleEdit',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {

      role: this.initRole(),
      screenWidth: 0,
      width: this.initWidth(),
      orgList: [],
      orgHidden: true,
      enums: {
        DataScopeType: {
          50: '全部',
          40: '本级以及子级',
          30: '本级',
          20: '自定义',
          10: '个人'
        }
      },
      rules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' },
          { min: 1, max: 255, message: '长度1-255个字符', trigger: 'blur' }
        ],
        locked: { required: true, message: '编码不能为空', trigger: 'blur' },
        orgList: {
          validator: (rule, value, callback) => {
            if (this.role.scopeType === '20') {
              if (this.$refs.orgTree.getCheckedKeys().length > 0) {
                callback()
              } else {
                // eslint-disable-next-line standard/no-callback-literal
                callback('请至少选择一个单位或部门')
              }
            } else {
              callback()
            }
          }
        }
      }
    }
  },
  computed: {
    isVisible: {
      get () {
        return this.dialogVisible
      },
      set () {
        this.close()
        this.reset()
      }
    },
    title () {
      return this.type === 'add' ? '添加' : '修改'
    }
  },
  watch: {},
  mounted () {
    this.initOrg()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initRole () {
      return {
        id: '',
        code: '',
        name: '',
        orgList: [],
        status: true,
        description: '',
        scopeType: null
      }
    },
    initWidth () {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '45%'
      } else {
        return '800px'
      }
    },
    initOrg () {
      OrgTree({ status: true })
        .then((response) => {
          console.log('this.orgList = response', response)
          this.orgList = response
        })
    },
    loadListOptions ({ callback }) {
      callback()
    },
    setRole (row) {
      const vm = this
      if (row) {
        vm.role = { ...row }
        this.orgHidden = vm.role.scopeType !== 20
        if (!this.orgHidden) {
          api.GetOrgDetails(vm.role.id)
            .then((res) => {
              const orgIds = res.map(roleOrg => roleOrg.orgId)
              this.$refs.orgTree.setCheckedKeys(orgIds)
            })
        }
      }
    },
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.role = this.initRole()
      this.orgHidden = true
      this.$refs.orgTree.setCheckedKeys([])
    },
    submitForm () {
      const vm = this
      this.$refs.form.validate((valid) => {
        if (valid) {
          vm.editSubmit()
        } else {
          return false
        }
      })
    },
    editSubmit () {
      const vm = this
      if (this.orgHidden && this.role.orgList) {
        this.role.orgList.length = 0
      } else {
        this.role.orgList = this.$refs.orgTree.getCheckedKeys()
      }

      if (vm.type === 'add') {
        vm.save()
      } else {
        vm.update()
      }
    },
    save () {
      const vm = this
      api.AddObj(this.role)
        .then((res) => {
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
    update () {
      const vm = this
      api.UpdateObj(this.role)
        .then((res) => {
          if (res.successful) {
            this.isVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            vm.$emit('success')
          }
        })
    },
    dsTypeChange (value) {
      this.orgHidden = value !== '20'
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
