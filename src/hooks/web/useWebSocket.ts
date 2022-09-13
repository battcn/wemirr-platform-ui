// noinspection JSUnusedGlobalSymbols
import { useGlobSetting } from '/@/hooks/setting';
import { computed, ref, unref, nextTick } from 'vue';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { useUserStore } from '/@/store/modules/user';
// import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useWebSocket, UseWebSocketReturn } from '@vueuse/core';
import { getTokenInfo } from '/@/utils/auth';
import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStoreWithOut } from '/@/store/modules/user';

const { createErrorModal } = useMessage();
export enum SocketMessageEvent {
  'AUTH_EVENT' = 'AUTH_EVENT',
  'ERROR_EVENT' = 'ERROR_EVENT',
  'NOTICE_EVENT' = 'NOTICE_EVENT',
  'BUSINESS_EVENT' = 'BUSINESS_EVENT',
  'ALL_EVENT' = 'ALL_EVENT',
}
export interface AuthMsgModel {
  data: string;
}
export interface BusinessMsgModel {
  data: string;
}
export interface ErrorMsgModel {
  data: string;
}
export interface NoticeMsgModel {
  data: string;
  dataType: number;
  type: number;
  showType: number;
  noticeShowType?: number;
}
export interface SocketMsgModel {
  data: AuthMsgModel | BusinessMsgModel | ErrorMsgModel | NoticeMsgModel;
  messageEvent: SocketMessageEvent;
  type: number;
}

const result = ref<UseWebSocketReturn<any>>();

const listeners = {
  AUTH_EVENT: new Set<Function>(),
  ERROR_EVENT: new Set<Function>(),
  NOTICE_EVENT: new Set<Function>(),
  BUSINESS_EVENT: new Set<Function>(),
  UP_DOWN: new Set<Function>(),
  ALL_EVENT: new Set<Function>(),
};

/**
 * 开启 WebSocket 链接，全局只需执行一次
 */
export function connectWebSocket() {
  const globSetting = useGlobSetting();
  const openSocket = globSetting.openSocket;
  // const { getShowNotice } = useHeaderSetting();
  if (!unref(getIsOpen) && openSocket) {
    const server = getSocketUrl();
    if (!server) {
      return;
    }
    result.value = useWebSocket(server, {
      autoReconnect: {
        retries: () => {
          // 如果token为空则停止重连
          const token = getTokenInfo();
          if (!token || Object.keys(token).length < 0) {
            return false;
          }
          return true;
        },
        delay: 4000,
      },
      heartbeat: {
        message: 'PING',
        interval: 10000,
      },
      onConnected: (__ws: WebSocket) => {
        onOpen();
      },
      onDisconnected: (__ws: WebSocket, event: CloseEvent) => {
        onClose(event);
      },
      onError: (__ws: WebSocket, event: Event) => {
        onError(event);
      },
      onMessage: (__ws: WebSocket, event: MessageEvent) => {
        onMessage(event);
      },
    });
  }
}

/**
 * 获取socket链接地址
 */
function getSocketUrl() {
  const token = getTokenInfo();
  if (!token || Object.keys(token).length < 0) {
    return '';
  }
  const globSetting = useGlobSetting();
  let socketUrl = globSetting.socketApi || '';
  if (socketUrl && socketUrl.indexOf('ws') < 0 && socketUrl.indexOf('wss') < 0) {
    socketUrl = globSetting.urlPrefix + globSetting.apiUrl + SysUrlPrefix.MESSAGE + socketUrl;
    socketUrl = socketUrl;
    const location = window.location;
    if (location.protocol == 'http:') {
      socketUrl = 'ws://' + location.host + socketUrl;
    } else {
      socketUrl = 'wss://' + location.host + socketUrl;
    }
  }
  return socketUrl + '?' + token['token_query_name'] + '=' + token.access_token;
}

/**
 * socket打开
 */
function onOpen() {
  console.log('[WebSocket] 连接成功');
}

/**
 * socket关闭
 */
function onClose(e) {
  console.log('[WebSocket] 连接断开：', e);
  // 如果登录过期则断开链接
  if (e.code == 4001 || e.code == 4002 || e.code == 4003) {
    const userStore = useUserStoreWithOut();
    const { t } = useI18n();
    const errMessage = e.reason || 'token无效';
    let secondsToGo = 3;
    let interval: any = null;
    const model = createErrorModal({
      title: t('sys.api.errorTip'),
      content: `${errMessage} ,${secondsToGo}秒后将自动退出登录,确认立马退出!!!`,
      onOk: () => {
        if (interval) {
          clearInterval(interval);
        }
        userStore.setTokenInfo(null);
        userStore.setSessionTimeout(true);
      },
    });
    interval = setInterval(() => {
      secondsToGo -= 1;
      model.update({
        content: `${errMessage} ,${secondsToGo}秒后将自动退出登录,确认立马退出!!!`,
      });
    }, 1000);
    setTimeout(() => {
      if (interval) {
        clearInterval(interval);
      }
      model.destroy();
      userStore.setTokenInfo(null);
      userStore.setSessionTimeout(true);
    }, secondsToGo * 1000);
  } else {
    // 调一次获取用户信息以免token在网关鉴权失败
    const userStore = useUserStore();
    userStore.getUserAndAuth();
  }
}

/**
 * socket发送了错误
 */
function onError(e) {
  console.log('[WebSocket] 连接发生错误: ', e);
}

/**
 * socket消息
 */
function onMessage(e: any) {
  if (e.data.toUpperCase() == 'PING') {
    unref(result)?.send('PONG');
    return;
  }
  if (e.data.toUpperCase() == 'PONG') {
    return;
  }
  try {
    const data = JSON.parse(e.data);
    const messageEvent = data.messageEvent;
    nextTick(() => {
      const eventListenerAll: Set<Function> = listeners['ALL_EVENT'];
      const specificEventListeners: Set<Function> = listeners[messageEvent];
      if (specificEventListeners.size > 0) {
        specificEventListeners.forEach((item) => eventListenerAll.add(item));
      }
      for (const callback of eventListenerAll) {
        try {
          const messageData = data.data;
          callback(messageData);
        } catch (err) {
          console.error(err);
        }
      }
    });

    // 所有监听类型
  } catch (err) {
    console.error('[WebSocket] data解析失败：', err);
  }
}

/**
 * 判断 WebSocket 是否是开启状态
 */
export const getIsOpen = computed(() => unref(result.value?.status) == 'OPEN');

/**
 * 添加 WebSocket 消息监听
 * @param callback
 */
export function onWebSocket(callback: (data: object) => any, messageEvent?: SocketMessageEvent) {
  let eventListener: Set<Function> = listeners['ALL_EVENT'];
  if (messageEvent) {
    const nowEventListener = listeners[messageEvent];
    if (nowEventListener) {
      eventListener = nowEventListener;
    }
  }
  if (!eventListener.has(callback)) {
    if (typeof callback === 'function') {
      eventListener.add(callback);
    } else {
      console.debug('[WebSocket] 添加 WebSocket 消息监听失败：传入的参数不是一个方法');
    }
  }
}

/**
 * 解除 WebSocket 消息监听
 *
 * @param callback
 */
export function offWebSocket(callback: (data: object) => any, messageEvent?: SocketMessageEvent) {
  let eventListener: Set<Function>;
  if (messageEvent) {
    eventListener = listeners[messageEvent];
  } else {
    eventListener = listeners['ALL_EVENT'];
  }
  eventListener.delete(callback);
}

export function useWebSocketResult() {
  return unref(result);
}
