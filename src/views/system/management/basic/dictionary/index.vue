<template>
  <d2-container>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div class="grid-content bg-purple">
            <dictionary  ref="dictionary" @dictionaryClick="dictionaryClick"/>
          </div>
        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div class="grid-content bg-purple-light">
            <dictionary-item ref="dictionaryItem" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<style>
  .box-card {
    margin: 5px;
  }
</style>

<script>
import Dictionary from './dictionary'
import DictionaryItem from './dictionary-item'

export default {
  name: 'formSelect',
  components: { Dictionary, DictionaryItem },
  data () {
    return {

    }
  },
  methods: {
    dictionaryClick (row) {
      this.$refs.dictionaryItem.dictionaryClick(row)
    }
  }
}
</script>
