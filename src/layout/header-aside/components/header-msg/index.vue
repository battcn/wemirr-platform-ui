<template>
  <div>
    <el-button class="d2-ml-0 d2-mr btn-text can-hover" type="text" @click="handleClickNotice" >
      <el-badge :value="messageList.length" :max="10">
        <el-icon name="bell" style="font-size: 20px"/>
      </el-badge>
    </el-button>
    <el-popover
      placement="bottom"
      width="400"
      class="right-menu-item hover-effect"
      v-model="visible"
      trigger="manual">
      <div class="avue-notice">
        <!--<div class="message-title-content">
          <div class="message-title">自动刷新</div>
          <div class="message-title-icon">
            <el-switch v-model="messageRefresh" @change="messageRefreshChange" title="是否自动刷新消息" active-color="#13ce66"
                       inactive-color="#ff4949"></el-switch>
          </div>
        </div>-->
        <el-tabs v-model="activeName" @tab-click="handleClick" style="padding: 0 23px 0 23px">
            <div v-for="item in messageList" :key="item.id">
              <div class="transition-box">
                <a href="javascript:;" @click="view(item)">
                  <div class="message-notice-line">
                    <div class="message-notice-name">{{ item.title }}</div>
                    <span class="message-notice-tag">
                      <el-tag size="small" effect="plain" :type="item.code">{{ item.code | messageTypeFilter }}</el-tag>
                    </span>
                  </div>
                  <div class="message-notice-time">{{ item.createdTime }}</div>
                </a>
                <el-divider/>
              </div>
            </div>
          <!--<el-tab-pane label="告警" name="third">
            告警
          </el-tab-pane>-->
        </el-tabs>
        <div class="message-notice-more" v-if="messageList.length > 10">
          <router-link :to="{path:'/message/more'}">点击查看更多<i class="el-icon-more"></i></router-link>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { request, baseWsURL } from '@/api/service'

export default {
  data () {
    return {
      visible: false,
      activeName: 'first',
      messageList: [],
      messageRefresh: false, // 消息是否自动刷新
      messageRefreshTimer: null
    }
  },
  filters: {
    messageTypeFilter (code) {
      const map = {
        success: '通知',
        info: '消息',
        danger: '告警'
      }
      return map[code] || ''
    }
  },
  created () {
    this.initWebSocket()
    this.loadMyMessage()
  },
  mounted () {
  },
  destroyed () {
    this.websock.close() // 离开路由之后断开websocket连接
  },
  methods: {
    ...mapMutations('d2admin/log', [
      'clean'
    ]),
    initWebSocket () {
      // 连接网关的 ws
      // const wsUri = baseWsURL + 'authority/station_messages/1'
      // const wsUri = 'ws://cloud-api.battcn.com/authority/station_messages/1'
      const wsUri = 'ws://139.224.230.72:9000/authority/station_messages/1'
      console.log('wsUri', wsUri)
      this.websock = new WebSocket(wsUri)
      this.websock.onmessage = e => {
        if (e && e.data) {
          console.log('接收结果', e.data)
          this.messageList.unshift(JSON.parse(e.data))
        }
      }
      this.websock.onopen = () => {
        const actions = { text: '连接成功' }
        this.send(JSON.stringify(actions))
      }
      this.websock.onerror = e => {
        console.log('断线重连', e)
        setInterval(() => {
          this.initWebSocket()
        }, 5000)
      }
      this.websock.onclose = e => {
        console.log('断开连接', e)
      }
    },
    send (Data) { // 数据发送
      this.websock.send(Data)
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    loadMyMessage () {
      request({ url: '/authority/users/1/station_messages' }).then(response => {
        this.messageList = response.data
      })
    },
    view (row) {
      request({
        url: `/authority/station_messages/${row.id}/mark`,
        method: 'patch'
      }).then(response => {
        this.messageList = this.messageList.filter(t => t.id !== row.id)
      })
    },
    handleClickNotice () {
      this.visible = !this.visible
    }
    // messageRefreshChange (val) {
    //   // db.save('message_REFRESH', val)
    //   if (val) {
    //     this.messageRefreshTimer = setInterval(() => {
    //       this.loadMyMessage()
    //     }, 15000)
    //   } else {
    //     clearInterval(this.messageRefreshTimer)
    //     console.log('定时拉取消息停止了！')
    //     this.messageRefreshTimer = null
    //   }
    // }
  }
}
</script>
<style>

  .el-popover {
    top: 62px;
    right: 80px;
    position: absolute;
    padding: 12px;
    z-index: 2000;
    font-size: 14px;
  }
</style>

<style lang="scss" scoped>
  .el-divider--horizontal {
    margin: 10px 0;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    right: 300px;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }

  .avatar-container {
    margin-right: 10px;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;

      .user-name {
        vertical-align: top;
        font-size: 1rem;
        margin-left: 5px;
        margin-top: -4px;
        display: inline-block;
      }

      .user-avatar {
        cursor: pointer;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        vertical-align: text-bottom;
      }

      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }

  .el-badge {
    .el-badge__content.is-fixed {
      top: 10px
    }
  }

  .message-title-content {
    color: #303133;
    font-size: 20px;
    line-height: 1;
    margin: 12px 0px 5px 0px;
    overflow: hidden;

    .message-title {
      margin-left: 20px;
      float: left;
    }

    .message-title-icon {
      float: right;
      margin-right: 28px;
    }
  }

  .message-notice-line {
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    color: #515a6e;
    margin-bottom: 4px;
    overflow: hidden
  }

  .message-notice-tag {
    float: right;
    margin-top: 2px;
  }

  .message-notice-name {
    line-height: 25px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 280px;
    float: left;
  }

  .message-notice-time {
    font-size: 12px;
    color: #808695;
  }

  .message-notice-more {
    text-align: center;
    padding: 20px 0 10px
  }

</style>
