<template>
  <el-dialog :close-on-click-modal="false" title="表格配置" :visible.sync="isVisible" width="1500px" top="50px">
<!--    <el-steps :active="active" simple>
      <el-step title="物理表配置" icon="el-icon-edit"></el-step>
      <el-step title="表单控件配置" icon="el-icon-upload"></el-step>
      <el-step title="表单校验配置" icon="el-icon-picture"></el-step>
      <el-step title="表单页面配置" icon="el-icon-picture"></el-step>
    </el-steps>-->
    <!--<d2-crud-x
      :columns="crud.columns"
      :data="data"
      :options="crud.options"
      ref="d2Crud"
      v-bind="_crudProps"
      v-on="_crudListeners"
      @cell-data-change="handleCellDataChange">
    </d2-crud-x>-->
    <d2-crud-x
      :columns="crud.columns"
      :data="data"
      :options="crud.options"
      ref="d2Crud"
      v-bind="_crudProps"
      v-on="_crudListeners">
    </d2-crud-x>
    <!--<div class="dialog-footer" slot="footer">
      <el-button :disabled="active === 0" style="margin-top: 12px;" @click="back" type="primary" icon="el-icon-arrow-left">上一步</el-button>
      <el-button style="margin-top: 12px;" @click="next" type="primary">{{ active === 3 ? '提交' : '下一步'}}<i class="el-icon-arrow-right el-icon&#45;&#45;right"></i></el-button>
    </div>-->
  </el-dialog>
</template>
<script>
import * as api from '../api.js'

import { crudOptions } from './crud'
import { d2CrudPlus } from 'd2-crud-plus'
export default {
  name: 'GridConfig',
  components: {},
  mixins: [d2CrudPlus.crud],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      options: {
        border: true,
        stripe: true
      },
      active: 0,
      disabled: false,
      columns: [{
        title: '列表配置',
        align: 'center',
        children: [
          {
            title: '物理列名',
            key: 'key',
            component: {
              name: 'el-input',
              size: 'small'
            }
          },
          {
            title: '字段名称',
            key: 'title',
            // align: 'center',
            component: {
              name: 'el-input',
              size: 'small'
            }
          },
          {
            title: '组件类型',
            align: 'center',
            key: 'type',
            value: 1,
            component: {
              name: 'dict-select',
              size: 'small',
              props: {
                dict: {
                  data: [
                    { value: 1, label: '单行文本' },
                    { value: 2, label: '下拉选项' }
                  ]
                }
              }
            }
          },
          {
            title: '列表显示',
            key: 'disabled',
            align: 'center',
            width: 90,
            component: {
              name: 'el-switch',
              size: 'small'
            }
          }]
      },
      {
        title: '查询配置',
        align: 'center',
        children: [
          {
            title: '查询配置',
            align: 'center',
            width: 90,
            key: 'search.disabled',
            component: {
              name: 'el-switch',
              size: 'small'
            }
          },
          {
            title: '查询类型',
            key: 'search.type',
            align: 'center',
            value: 1, // 默认值
            component: {
              name: 'dict-select',
              size: 'small',
              props: {
                dict: {
                  data: [
                    { value: 1, label: '等于(=)' },
                    { value: 2, label: '大于(>)' }
                  ]
                }
              }
            }
          }
        ]
      },
      {
        title: '表单配置',
        align: 'center',
        children: [
          {
            title: '表单显示',
            align: 'center',
            width: 90,
            key: 'form.disabled',
            component: {
              name: 'el-switch',
              size: 'small'
            }
          }
        ]
      },
      {
        title: '表单验证',
        align: 'center',
        children: [
          {
            title: '必填',
            align: 'center',
            width: 90,
            key: 'form.rules.required',
            component: {
              name: 'el-switch',
              size: 'small'
            }
          },
          {
            title: '验证类型',
            align: 'center',
            key: 'form.rules.type',
            component: {
              name: 'dict-select',
              size: 'small',
              props: {
                dict: {
                  data: [
                    { value: 1, label: '邮箱' },
                    { value: 2, label: '手机' }
                  ]
                }
              }
            }
          }
        ]
      },
      {
        title: '字典配置',
        align: 'center',
        children: [
          {
            title: '字典编码',
            key: 'dict.code',
            component: {
              name: 'dict-select',
              size: 'small',
              props: {
                dict: {
                  data: [
                    { value: 1, label: '字典1' },
                    { value: 2, label: '字典2' }
                  ]
                }
              }
            }
          },
          {
            title: 'API编码',
            key: 'dict.api',
            component: {
              name: 'dict-select',
              size: 'small',
              props: {
                dict: {
                  data: [
                    { value: 1, label: '学生' },
                    { value: 2, label: '老师' }
                  ]
                }
              }
            }
          }
        ]
      }
      ],
      data: [
        {
          key: 'key',
          title: '标题',
          disabled: true,
          type: 1,
          search: {
            disabled: false,
            type: 1
          },
          form: {
            disabled: true,
            rules: {
              required: false,
              type: 1
            }
          },
          dict: {
            code: 1,
            api: 1
          }
        }
      ]
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

  },
  methods: {
    getCrudOptions () {
      return crudOptions(this)
    },
    pageRequest (query) {
      return api.GetList(query)
    },
    addRequest (row) {
      return api.AddObj(row)
    },
    updateRequest (row) {
      return api.UpdateObj(row)
    },
    delRequest (row) {
      return api.DelObj(row.id)
    },
    init (row) {
      console.log('row', row)
      api.GetColumnList().then(res => {
        // this.data = res.data
      })
      // this.columns = this.columns2
    },
    handleCellDataChange ({ rowIndex, key, value, row }) {
      console.log(rowIndex)
      console.log(key)
      console.log(value)
      console.log(row)
    },
    next () {
      if (this.active < 3) {
        this.active = this.active + 1
        this.columns = this.columns2
      } else {
        this.columns = this.columns1
        this.$confirm(
          '是否提交表格配置？',
          '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          //
        }).catch((err) => {
          console.log('err', err)
        })
      }
    },
    back () {
      if (this.active-- < 1) this.active = 0
    },
    submitForm () {

    },
    close () {
      this.$emit('close')
    },
    reset () {
      // 先清除校验，再清除表单，不然有奇怪的bug
      this.disabled = false
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
