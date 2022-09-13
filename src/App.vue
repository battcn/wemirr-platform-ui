<template>
  <ConfigProvider :locale="getAntdLocale">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { onMounted } from 'vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';
  import { onWebSocket, SocketMessageEvent } from '/@/hooks/web/useWebSocket';
  import 'dayjs/locale/zh-cn';
  // support Multi-language
  const { getAntdLocale } = useLocale();

  // Listening to page changes and dynamically changing site titles
  useTitle();
  onMounted(() => {
    onWebSocket(onWebSocketMessage, SocketMessageEvent.ERROR_EVENT);
  });
  function onWebSocketMessage(data: any) {
    console.log('--------data-----app-------', data);
  }
</script>
