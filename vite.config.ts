import type { UserConfig, ConfigEnv } from 'vite';
import pkg from './package.json';
import dayjs from 'dayjs';
import { loadEnv } from 'vite';
import { resolve } from 'path';
import { generateModifyVars } from './build/generate/generateModifyVars';
import { createProxy } from './build/vite/proxy';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { OUTPUT_DIR } from './build/constant';
const timestamp = new Date().getTime();
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;

  const isBuild = command === 'build';

  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias: [
        {
          find: 'vue-i18n',
          replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
        },
        // /@/xxxx => src/xxxx
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        // /#/xxxx => types/xxxx
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      https: false,
      open: true,
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: createProxy(VITE_PROXY),
    },
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : [],
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      outDir: OUTPUT_DIR,
      minify: 'terser',
      /**
       * 当 minify=“minify:'terser'” 解开注释
       * Uncomment when minify="minify:'terser'"
       */
      terserOptions: {
        compress: {
          drop_console: true, //打包时删除console
          drop_debugger: true, //打包时删除 debugger
          pure_funcs: ['console.log'],
        },
        output: {
          // 去掉注释内容
          comments: true,
        },
      },
      // Turning off brotliSize display can slightly reduce packaging time
      reportCompressedSize: false,
      cssCodeSplit: true, //如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // 最小化拆分包
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: `assets/[name].[hash].${timestamp}.js`, // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: `assets/[name].[hash].${timestamp}.js`, // 拆分js到模块文件夹
          assetFileNames: `assets/[name].[hash].${timestamp}.[ext]`, // 用于输出静态资源的命名
        },
      },
    },
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },

    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
    plugins: createVitePlugins(viteEnv, isBuild),

    optimizeDeps: {
      // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
      include: [
        '@vue/runtime-core',
        '@vue/shared',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
  };
};
