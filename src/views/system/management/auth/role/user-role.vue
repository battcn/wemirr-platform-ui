<template>
  <el-dialog :close-on-click-modal="false" title="分配角色成员" :visible.sync="isVisible" width="900px" top="50px">
    <el-form :model="userRole" :rules="rules" label-position="right" label-width="60px" ref="form">
      <el-form-item prop="userIdList" class="edit_dev">
        <el-transfer
          :data="userList"
          :filter-method="filterMethod"
          :props="{
            key: 'id',
            label: 'nickName'
          }"
          :render-content="renderFunc"
          :right-default-checked="userRole.userIdList"
          :titles="['全部用户', '已选用户']"
          filter-placeholder="用户名"
          filterable
          style="text-align: left; display: inline-block;"
          v-model="userRole.userIdList"
        />
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="isVisible = false" plain type="warning">取消</el-button>
      <el-button :disabled="disabled" @click="submitForm" plain type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { GetList as GetUserList } from '@/views/system/management/user/api.js'
import * as api from './api.js'

export default {
  name: 'UserRoleEdit',
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      userRole: this.initUserRole(),
      screenWidth: 0,
      width: this.initWidth(),
      userList: [],
      userIdList: [],
      disabled: false,
      rules: {

      },
      renderFunc (h, option) {
        return h('span', {
          attrs: {
            title: option.username + ' - ' + option.nickName
          }
        }, [option.username, ' - ', option.nickName])
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
    }
  },
  watch: {

  },
  mounted () {
    this.initUserList()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
      })()
    }
  },
  methods: {
    initUserRole () {
      return {
        roleId: '',
        userIdList: []
      }
    },
    initWidth () {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '55%'
      } else {
        return '950px'
      }
    },
    initUserList () {
      GetUserList({ current: 1, size: 100000, model: { status: true } })
        .then((res) => {
          this.userList = res.data.records
          console.log('====>>>', res)
        }).catch(() => {
          this.$message({
            message: '数据获取失败',
            type: 'error'
          })
        })
    },
    setUserRole (val) {
      const vm = this
      vm.userRole.roleId = val.id
      api.GetUserIdByRoleId(val.id)
        .then((res) => {
          vm.userRole.userIdList = res.data
        })
    },
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
      this.userRole = this.initUserRole()
      this.disabled = false
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
      api.AddUserRole(this.userRole)
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
    filterMethod (query, item) {
      return item.nickName.indexOf(query) > -1 || item.username.indexOf(query) > -1
    }
  }
}
</script>
<style scoped>
  .edit_dev >>> .el-transfer-panel {
    width:280px;
  }
  .edit_dev >>> .el-input{
    width: 250px;
  }
</style>
