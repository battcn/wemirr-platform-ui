<template>
  <ConfigProvider :locale="getAntdLocale" :theme="themeConfig">
    <AppProvider>
      <fs-form-provider>
        <RouterView />
      </fs-form-provider>
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
import { ConfigProvider } from "ant-design-vue";
import { AppProvider } from "@/components/Application";
import { useTitle } from "@/hooks/web/useTitle";
import { useLocale } from "@/locales/useLocale";

import { useDarkModeTheme } from "@/hooks/setting/useDarkModeTheme";

import { useWatermark } from "@/hooks/web/useWatermark";
import { useGlobSetting } from "@/hooks/setting";
import "dayjs/locale/zh-cn";
import { onMounted, computed } from "vue";

const { setWatermark } = useWatermark();
// support Multi-language
const { getAntdLocale } = useLocale();

const { isDark, darkTheme } = useDarkModeTheme();
const themeConfig = computed(() =>
  Object.assign(
    {
      token: {
        colorPrimary: "#0960bd",
        colorSuccess: "#55D187",
        colorWarning: "#EFBD47",
        colorError: "#ED6F6F",
        colorInfo: "#0960bd",
      },
    },
    isDark.value ? darkTheme : {},
  ),
);
// Listening to page changes and dynamically changing site titles
useTitle();
const { title } = useGlobSetting();
onMounted(async () => {
  setWatermark(title);
});
</script>
