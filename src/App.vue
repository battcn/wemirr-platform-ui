<template>
  <ConfigProvider :locale="getAntdLocale" :theme="isDark ? darkTheme : {}">
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { ConfigProvider } from "ant-design-vue";
import { AppProvider } from "@/components/Application";
import { useTitle } from "@/hooks/web/useTitle";
import { useLocale } from "@/locales/useLocale";

import "dayjs/locale/zh-cn";
import { useDarkModeTheme } from "@/hooks/setting/useDarkModeTheme";

import { useWatermark } from "@/hooks/web/useWatermark";
import { onMounted } from "vue";
import { useGlobSetting } from "@/hooks/setting";

const { setWatermark } = useWatermark();
// support Multi-language
const { getAntdLocale } = useLocale();

const { isDark, darkTheme } = useDarkModeTheme();

// Listening to page changes and dynamically changing site titles
useTitle();
const { title } = useGlobSetting();
onMounted(async () => {
  setWatermark(title);
});
</script>
