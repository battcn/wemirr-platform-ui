import {defineOverridesPreferences} from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
    // overrides
    app: {
        name: import.meta.env.VITE_APP_TITLE,
        // 是否开启检查更新
        enableCheckUpdates: true,
        // 检查更新的时间间隔，单位为分钟
        checkUpdatesInterval: 5,
        accessMode: 'backend',
        "contentCompact": "wide",
        "layout": "sidebar-mixed-nav"
    },
    "copyright": {
        "companyName": "WEMIRR-PLATFORM",
        "companySiteLink": "https://docs.battcn.com/"
    },
    "footer": {
        "enable": true
    },
    "theme": {
        "mode": "auto"
    }
});