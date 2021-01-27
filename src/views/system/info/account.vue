<template>
  <el-form :model="user" :rules="rules" class="form" label-position="right" label-width="80px" ref="form">
    <el-form-item label="姓名" prop="email">
      <el-input v-model="user.nickName"/>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email"/>
    </el-form-item>
    <el-form-item label="电话" prop="mobile">
      <el-input v-model="user.mobile"/>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-select v-model="user.sex">
        <el-option key="1" label="男" value="1"/>
        <el-option key="2" label="女" value="2"/>
      </el-select>
    </el-form-item>
    <el-form-item label="工作描述" prop="workDescribe">
      <el-input rows="3" type="textarea" v-model="user.description"/>
    </el-form-item>
    <el-form-item>
      <el-button @click="submit" plain type="primary">修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { validMobile } from '@/utils/my-validate'
import * as api from './api.js'

export default {
  components: {},
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          nickName: '',
          mobile: '',
          email: '',
          description: '',
          sex: undefined
        }
      }
    }
  },
  data () {
    return {
      rules: {
        email: { type: 'email', message: '邮箱错误', trigger: 'blur' },
        mobile: {
          validator: (rule, value, callback) => {
            if (value !== '' && !validMobile(value)) {
              callback('手机号格式错误')
            } else {
              callback()
            }
          },
          trigger: 'blur'
        },
        sex: { required: true, message: '性别不能为空', trigger: 'change' },
        workDescribe: { max: 255, message: '内容超过255字符', trigger: 'blur' }
      }
    }
  },
  computed: {},
  mounted () {

  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return false
        }
        const obj = {
          id: this.user.userId,
          nickName: this.user.nickName,
          mobile: this.user.mobile,
          description: this.user.description,
          sex: this.user.sex
        }
        api.UpdateUserInfo(obj)
          .then((res) => {
            if (res.successful) {
              this.$message({
                message: res.message,
                type: 'success'
              })
            }
            this.$store.commit('account/setUser', this.user)
          })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  padding: 10px 0 0 0;
}
</style>
