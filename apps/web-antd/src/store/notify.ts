import { ref } from 'vue';

import { useAccessStore, useUserStore } from '@vben/stores';

import { defineStore } from 'pinia';

export const useNotifyStore = defineStore('notify', () => {
  const userStore = useUserStore();
  const socket = ref<null | WebSocket>(null);
  const isConnected = ref(false);
  const lastMessage = ref<any>(null);

  function connect() {
    if (isConnected.value || socket.value) {
      return;
    }
    // 优先取 userId，如果没有则取 id
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const identifier = userStore.userInfo?.userId ?? userStore.userInfo?.id;
    const tenantCode = userStore.userInfo?.tenantCode;

    if (!tenantCode || !identifier) {
      // 可能是未登录或者用户信息不全
      return;
    }

    // 获取 WS 地址
    let wsUrl = import.meta.env.VITE_GLOB_API_URL as string;

    // 如果没有配置，或者配置为空，则自动推断
    if (!wsUrl) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      wsUrl = `${protocol}//${host}`;
    } else if (wsUrl.startsWith('/')) {
      // 如果配置的是相对路径，则需要拼接 host
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      wsUrl = `${protocol}//${host}${wsUrl}`;
    }
    // 移除末尾斜杠
    if (wsUrl.endsWith('/')) {
      wsUrl = wsUrl.slice(0, -1);
    }
    const accessStore = useAccessStore();
    const url = `${wsUrl}/iam/message/${tenantCode}/${identifier}?accessToken=${accessStore.accessToken}`;
    try {
      // console.log('WebSocket connecting to:', url);
      const ws = new WebSocket(url);

      ws.addEventListener('open', () => {
        // console.log('WebSocket connected success');
        isConnected.value = true;
        socket.value = ws;
      });

      ws.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          lastMessage.value = data;
          // console.log('WebSocket message received:', data);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      ws.addEventListener('close', () => {
        isConnected.value = false;
        socket.value = null;
      });

      ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
        isConnected.value = false;
      });
    } catch (error) {
      console.error('WebSocket connection creation failed:', error);
    }
  }

  function close() {
    if (socket.value) {
      socket.value.close();
      socket.value = null;
      isConnected.value = false;
    }
  }

  function $reset() {
    close();
    socket.value = null;
    isConnected.value = false;
    lastMessage.value = null;
  }

  return {
    $reset,
    close,
    connect,
    isConnected,
    lastMessage,
  };
});
