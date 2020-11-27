// Vue
import Vue from 'vue'
import i18n from './i18n'
import App from './App'
// 核心插件
import d2Admin from '@/plugin/d2admin'
import iconPicker from 'e-icon-picker'
// store
import store from '@/store/index'

// 菜单和路由设置
import router from './router'
// import { menuHeader } from '@/menu'
import { menuHeader, menuAside } from '@/menu'
import { frameInRoutes } from '@/router/routes'
// import { loadScriptQueue } from '@/utils/loadScript'
import ElPhoneNumberInput from 'el-phone-number-input'
import pluginExport from '@d2-projects/vue-table-export'

// form gen
import '@/styles/index.scss'
import '@/icons'
import Tinymce from '@/components/tinymce/index.vue'
import * as monaco from 'monaco-editor'
// 滚动条监控警告处理
import 'default-passive-events'

// d2-crud-plus 安装与初始化
import './install'
import './business/modules/permission'
// 核心插件
Vue.use(d2Admin)
Vue.use(iconPicker)// 使用e-icon-picker
Vue.use(pluginExport)
Vue.use(monaco)
Vue.component('tinymce', Tinymce)
// Vue.component('link-button', () => import('@/business/components/link-button/index.vue'))
// Vue.component('example-helper', () => import('@/business/components/example-helper/index.vue'))
Vue.component('el-phone-number-input', ElPhoneNumberInput)

new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
  created () {
    // 处理路由 得到每一级的路由设置
    this.$store.commit('d2admin/page/init', frameInRoutes)
    // 设置顶栏菜单
    this.$store.commit('d2admin/menu/headerSet', menuHeader)
    // 设置侧边栏菜单
    this.$store.commit('d2admin/menu/asideSet', menuAside)
    // 初始化菜单搜索功能
    this.$store.commit('d2admin/search/init', menuHeader)
  },
  mounted () {
    // 展示系统信息
    this.$store.commit('d2admin/releases/versionShow')
    // 用户登录后从数据库加载一系列的设置
    this.$store.dispatch('d2admin/account/load')
    // 获取并记录用户 UA
    this.$store.commit('d2admin/ua/get')
    // 初始化全屏监听
    this.$store.dispatch('d2admin/fullscreen/listen')
  },
  watch: {
    // 检测路由变化切换侧边栏内容
    '$route.matched': {
      handler (matched) {
        if (matched.length > 0) {
          const _side = menuHeader.filter(menu => menu.path === matched[0].path)
          if (_side.length > 0) {
            this.$store.commit('d2admin/menu/asideSet', _side[0].children)
          }
        }
      },
      immediate: true
    }
  }
}).$mount('#app')
