<template>
  <div >
    <d2-crud-x
      ref="d2Crud"
      v-bind="_crudProps"
      v-on="_crudListeners"
    >
    </d2-crud-x>
  </div>
</template>

<script>
import * as api from './api'
import { d2CrudPlus } from 'd2-crud-plus'
export default {
  name: 'subTable',
  mixins: [d2CrudPlus.crud],
  props: {
    value: {
    }
  },
  data () {
    return {
      crudOptions: {}
    }
  },
  watch: {
  },
  created () {
    // console.log('form', this.value)
  },
  methods: {
    _OnCreated () {
      const model = this.value.model
      api.GetCrudOptions(model).then(res => {
        this.crudOptions = res.data
        this.crudOptions.rowHandle = false
        this._doStart()
      })
    },
    getCrudOptions () {
      return this.crudOptions
    },

    pageRequest (query) {
      const model = this.value.model
      return api.GetList(model, query)
    }
  }
}
</script>
