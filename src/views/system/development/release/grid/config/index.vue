<template>
  <el-dialog :close-on-click-modal="false" title="表格配置" :visible.sync="isVisible" width="1400px" top="50px">
    <d2-crud-x
      :columns="crud.columns"
      :options="crud.options"
      ref="d2Crud"
      v-bind="_crudProps"
      v-on="_crudListeners">
    </d2-crud-x>
  </el-dialog>
</template>
<script>
import * as api from './api.js'

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
      disabled: false,
      grid: {},
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
    /**
       * 第一次请求页面数据
       * initColumns初始化完成后调用
       * 可以用一个空方法覆盖它，阻止初始化后请求数据
       */
    doLoad () {
      // return this.doRefresh({ from: 'load' })
    },
    pageRequest (query) {
      query.gridId = this.grid.id
      return api.GetColumnList(query)
    },
    addRequest (row) {
      return api.AddObj(row)
    },
    updateRequest (row) {
      row.gridId = this.grid.id
      console.log('row=>', row)
      return api.UpdateObj(row).then(ret => {
        return { row }
      })
    },
    delRequest (row) {
      return api.DelObj(row.id)
    },
    init (row) {
      console.log('row', row)
      this.grid = row
      this.doSearch()
      // api.GetColumnList({ gridId: row.id }).then(res => {
      //   // this.data = res.data
      // })
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
