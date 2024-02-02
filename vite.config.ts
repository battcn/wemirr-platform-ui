import { defineApplicationConfig } from "@vben/vite-config";

export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        "echarts/core",
        "echarts/charts",
        "echarts/components",
        "echarts/renderers",
        "qrcode",
        "@iconify/iconify",
        "ant-design-vue/es/locale/zh_CN",
        "ant-design-vue/es/locale/en_US",
      ],
    },
    server: {
      proxy: {
        "/dev-api": {
          target: "http://localhost:9000",
          // target: "https://cloud.battcn.com/api",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/dev-api`), ""),
        },
        "/api": {
          target: "https://cloud.battcn.com/api",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/api`), ""),
        },
        "/upload": {
          target: "https://localhost:9000/tools/files/upload",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/upload`), ""),
        },
      },
      warmup: {
        clientFiles: ["./index.html", "./src/{views,components}/*"],
      },
    },
  },
});
