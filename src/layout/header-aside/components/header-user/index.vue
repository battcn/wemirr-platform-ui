<template>
  <div>
    <el-dropdown size="small" class="d2-mr">
      <span class="btn-text">{{ info.nickName ? `你好 ${info.nickName}` : '未登录' }}</span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="routerUserInfo">个人信息</el-dropdown-item>
        <el-dropdown-item>项目地址</el-dropdown-item>
        <el-dropdown-item>文档中心</el-dropdown-item>

        <el-dropdown-item divided @click.native="dialogVisible = true">主题设置</el-dropdown-item>

        <el-dropdown-item divided>清除缓存</el-dropdown-item>
        <el-dropdown-item @click.native="logOff" divided>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog
      title="主题"
      width="600px"
      :visible.sync="dialogVisible"
      :append-to-body="true">
      <d2-theme-list style="margin-top: -25px;"/>
    </el-dialog>
  </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import themeList from '@/components/d2-theme-list'

export default {
  components: {
    'd2-theme-list': themeList
  },
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  },
  methods: {
    ...mapActions('d2admin/account', [
      'logout'
    ]),
    routerUserInfo () {
      this.$router.push({
        name: 'info'
      })
    },
    /**
     * @description 登出
     */
    logOff () {
      this.logout({
        confirm: true
      })
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  }
}
</script>
