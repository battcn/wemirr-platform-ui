<template>
  <d2-container>
    <div v-if="info">
      <el-row :gutter="20">
        <el-col :span="8" :xs="24">
          <user-card :user="info"/>
        </el-col>
        <el-col :span="16" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="登录时间" name="timeline">
                <timeline :user="info"/>
              </el-tab-pane>
              <el-tab-pane label="账号信息" name="account">
                <account :user="info"/>
              </el-tab-pane>
              <el-tab-pane label="个人密码" name="password">
                <password :user="info"/>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </d2-container>
</template>

<script>
import UserCard from './user'
import Password from './password'
import Timeline from './timeline'
import Account from './account'
import userApi from './api.js'
import { mapState } from 'vuex'
export default {
  name: 'Profile',
  components: { UserCard, Password, Timeline, Account },
  data () {
    return {
      activeTab: ''
    }
  },
  computed: {
    ...mapState('d2admin/user', ['info'])
  },
  created () {
    this.activeTab = 'timeline'
  },
  mounted () {
    this.initUser()
  },
  methods: {
    initUser () {
      // console.log('this.$store.state.account.user', this.info)
      // userApi.get(this.$store.state.account.user.id).then(response => {
      //   const res = response.data
      //   if (res.isSuccess) {
      //     this.user = res.data
      //   }
      // })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-card.is-always-shadow {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-card {
  border: none;
  border-radius: 0;
}
</style>
