<template>
  <el-form :model="p" :rules="rules" class="form" label-position="right" label-width="80px" ref="form">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input type="password" v-model="p.oldPassword" />
    </el-form-item>
    <el-form-item label="新密码" prop="password">
      <el-input type="password" v-model="p.password" />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input type="password" v-model="p.confirmPassword" />
    </el-form-item>
    <el-form-item>
      <el-button @click="submit" plain type="primary">修改</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import * as api from './api.js'
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  data () {
    return {
      p: {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (this.p.password !== value) {
                callback('两次输入不一致')
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          api.UpdatePassword({
            ...this.p,
            ...{ id: this.user.id }
          }).then((res) => {
            if (res.successful) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.$refs.form.clearValidate()
              this.$refs.form.resetFields()
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
