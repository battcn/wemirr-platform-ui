import config from './index.mjs';
import 'node:path';
import '@iconify/tailwind';
import '@manypkg/get-packages';
import '@tailwindcss/typography';
import 'tailwindcss-animate';
import 'tailwindcss/plugin.js';

const postcss_config = {
  plugins: {
    ...process.env.NODE_ENV === "production" ? { cssnano: {} } : {},
    // Specifying the config is not necessary in most cases, but it is included
    autoprefixer: {},
    // 修复 element-plus 和 ant-design-vue 的样式和tailwindcss冲突问题
    "postcss-antd-fixes": { prefixes: ["ant", "el"] },
    "postcss-import": {},
    "postcss-preset-env": {},
    tailwindcss: { config },
    "tailwindcss/nesting": {}
  }
};

export { postcss_config as default };
