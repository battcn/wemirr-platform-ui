<template>
  <d2-container>
    <el-row :gutter="10">
      <el-col :sm="24" :xs="24">
        <el-card class="box-card">
          <el-row :gutter="10">
            <el-col :sm="12" :xs="24">
              <div class="user-wrapper">
                <div class="user-header">
                  <el-avatar :size="60"
                             src="http://tangyh.top:10000/zuihou-ui/static/img/cnrhVkzwxjPwAaCfPbdc.1b71a9dc.png"
                             fit="fill">
                    <el-avatar :size="60">{{ user.name }}</el-avatar>
                  </el-avatar>
                </div>
                <div class="user-info">
                  <div class="random-message">
                    下午好, 平台超管, 今天吃了什么好吃的呢
                  </div>
                  <div class="user-dept">
                    <span>疯狂加班</span>
                  </div>
                  <div class="user-login-info">
                    上次登录时间：
                    <span id="last-login-time">第一次登录系统</span>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :sm="12" :xs="24">
              <div class="user-visits">
                <el-row style="margin-bottom: .7rem">
                  <el-col :offset="4" :span="4">今日IP数</el-col>
                  <el-col :offset="4" :span="4">总登录数</el-col>
                </el-row>
                <el-row>
                  <el-col :offset="4" :span="4" class="num">
                    <el-link type="primary">
                      {{todayIp}}
                    </el-link>
                  </el-col>
                  <el-col :offset="4" :span="4" class="num">
                    <el-link type="primary">
                      {{loginTotal}}
                    </el-link>
                  </el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card class="box-card">
          <div class="grid-content bg-purple" style="height: 400px">
            <p class="primary" style="color:#409EFF">近十天系统访问记录</p>
            <ve-histogram :data="loginRecords" v-bind="pubSetting"></ve-histogram>
          </div>
        </el-card>

      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div class="grid-content bg-purple-light" style="height: 400px">
            <p class="primary" style="color:#409EFF">登录前七的地区</p>
            <ve-histogram :data="loginAreas" v-bind="pubSetting"></ve-histogram>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </d2-container>
</template>

<script>
import Vue from 'vue'
import VCharts from 'v-charts'
import * as api from './api'

Vue.use(VCharts)
export default {
  mixins: [
  ],
  data () {
    return {
      pubSetting: {
        height: '100%'
      },
      todayIp: 0,
      loginTotal: 0,
      loginRecords: {},
      loginAreas: {},
      user: {
        name: '唐亚峰'
      }
    }
  },
  created () {
    this.initDashboards()
  },
  methods: {
    initDashboards () {
      // axios从后台获取数据
      api.getDashboards().then((response) => {
        const res = response.data
        this.todayIp = res.todayIp
        this.loginTotal = res.loginTotal
        const loginRecords = []
        const loginAreas = []
        for (const item of res.loginRecords) {
          loginRecords.push({ 日期: item.date, 您: item.you, 总数: item.total })
        }
        this.loginRecords = { columns: ['日期', '总数'], rows: loginRecords }
        for (const item of res.loginAreas) {
          loginAreas.push({ 地区: item.location, 总数: item.total })
        }
        this.loginAreas = { columns: ['地区', '总数'], rows: loginAreas }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .user-wrapper {
    .user-header {
      display: inline-block;
      vertical-align: middle;
    }

    .user-info {
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;

      .random-message {
        font-size: 1rem;
        margin-bottom: 0.5rem;
      }

      .user-dept,
      .user-login-info {
        color: rgba(0, 0, 0, 0.45);
        margin-bottom: 0.5rem;
        font-size: 0.8rem;
        line-height: 1.1rem;
      }
    }
  }

  .user-visits {
    text-align: center;
    padding-right: 2rem;
    margin-top: 1rem;
    vertical-align: middle;

    .num {
      font-weight: 600;
    }
  }
</style>
