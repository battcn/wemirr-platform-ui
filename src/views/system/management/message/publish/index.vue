<template>
  <d2-container>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="5">
          <el-form-item label="消息类型" prop="type" required>
            <dict-select clearable v-model="form.type" :dict="getDict({
            url: '/authority/dictionaries/NOTICE/list',
            value: 'code',
            label: 'name'
            })"/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="标题" prop="title" required>
            <el-input v-model="form.title" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="消息状态" required>
            <el-radio v-model="form.status" label="1" border size="medium">普通</el-radio>
            <el-radio v-model="form.status" label="2" border size="medium">加急</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <el-form-item label="接收群体" required >
            <el-radio-group  v-model="form.receiverType" size="medium" @change="receiverType">
              <el-radio label="1" border >用户</el-radio>
              <el-radio label="2" border >角色</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="接收者" required prop="receiver">
            <dict-select multiple v-model="form.receiver"  :dict="getDict({
              url: `/authority/list//${form.receiverType}/users_or_roles`
              })"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="消息内容" prop="content" required>
            <d2p-quill :config="{zIndex:100}" v-model="form.content"></d2p-quill>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align: right">
        <el-button type="primary" @click="submitForm('form')">立即创建</el-button>
      </el-form-item>
    </el-form>
  </d2-container>
</template>

<script>
import { d2CrudPlus } from 'd2-crud-plus'
import * as api from './api'

export default {
  name: 'independent',
  data () {
    return {
      radio2: '1',
      getDict (dict) {
        return d2CrudPlus.util.dict.mergeDefault(dict)
      },
      form: {
        type: 'success',
        status: '1',
        title: '',
        receiver: [],
        receiverType: '1',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '请填写消息标题' },
          { min: 2, max: 30, message: '长度在 3 到 30 个字符' }
        ],
        content: [
          { required: true, message: '请填写消息内容' }
        ],
        type: [
          { required: true, message: '请选择消息类型' }
        ],
        receiver: [
          { type: 'array', required: true, message: '请选择接收者' }
        ]
      },
      dictData: []
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        console.log('formName', this.form)
        if (valid) {
          api.PublishMessage(this.form).then(res => {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
            // this.form.title = ''
            // this.form.content = ''
            // this.form.receiver = []
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    receiverType (val) {
      this.form.receiver = []
    }
  }
}
</script>
