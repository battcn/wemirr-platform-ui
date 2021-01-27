<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item :key="index" :timestamp="item.createTime" placement="top" v-for="(item,index) of timeline">
        <el-card>
          <p>
            <el-icon class="el-icon-link" />
            IP：{{ item.ip }}
          </p>
          <p>
            <el-icon class="el-icon-location-outline" />
            地区：{{ item.location }}
          </p>
          <p>
            <el-icon class="el-icon-bangzhu" />
            浏览器：{{ item.browser }}
          </p>
          <p>
            <el-icon class="el-icon-monitor" />
            操作系统：{{ item.os }}
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
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
      timeline: []
    }
  },
  mounted () {
    this.getTimeLine()
  },
  methods: {
    getTimeLine () {
      console.log('===getTimeLine')
      api.GetLoginLogList({ current: 1, size: 5 })
        .then((res) => {
          this.timeline = res.data.records
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card.is-always-shadow {
  box-shadow: none;
}
.el-card {
  border: 1px solid #f1f1f1;
  border-radius: 2px;
}
</style>
