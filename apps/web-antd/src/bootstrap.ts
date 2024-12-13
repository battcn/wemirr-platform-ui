import { createApp, watchEffect } from 'vue';

import { registerAccessDirective } from '@vben/access';
import { preferences } from '@vben/preferences';
import { initStores } from '@vben/stores';
import '@vben/styles';
import '@vben/styles/antd';

import { useTitle } from '@vueuse/core';
import { setupAntd } from 'epic-designer/dist/ui/antd';

import { $t, setupI18n } from '#/locales';
import { registerFastCrud } from '#/plugin/fast-crud/setup-fast-crud.tsx';

import { initComponentAdapter } from './adapter/component';
import App from './app.vue';
import { router } from './router';

// 引入epic-designer样式
import 'epic-designer/dist/style.css';

// 引入antd UI 重置样式
import 'ant-design-vue/dist/reset.css';

async function bootstrap(namespace: string) {
  // 初始化组件适配器
  await initComponentAdapter();

  const app = createApp(App);

  // 国际化 i18n 配置
  await setupI18n(app);

  // 配置 pinia-tore
  await initStores(app, { namespace });

  // 安装权限指令
  registerAccessDirective(app);

  // 配置路由及路由守卫
  app.use(router);

  // 动态更新标题
  watchEffect(() => {
    if (preferences.app.dynamicTitle) {
      const routeTitle = router.currentRoute.value.meta?.title;
      const pageTitle =
        (routeTitle ? `${$t(routeTitle)} - ` : '') + preferences.app.name;
      useTitle(pageTitle);
    }
  });
  // 使用Antd UI
  await setupAntd();
  // ----------- 安装fast-crud--------------
  await registerFastCrud(app);

  app.mount('#app');
}

export { bootstrap };
