## 演示图

![左侧菜单混合](./images/left_mix_style.png)
![顶部菜单混合-1](./images/top_mix.png)
![顶部菜单混合-2](./images/top_mix_style.png)
![顶部菜单混合-3](./images/top_mix_style2.png)

![分配用户](./images/binding_user.png)

![分配权限](./images/binding_res.png)

![黑白名单](./images/blacklist.png)

![限流配置](./images/limit.png)

![菜单管理](./images/menu.png)

![监控管理](./images/monitor.png)

![操作日志](./images/opt_log.png)

![发布消息](./images/publish_message.png)

![用户列表](./images/users.png)

## 准备

- [node](http://nodejs.org/) 和 [git](https://git-scm.com/) -项目开发环境
- [Vite](https://vitejs.dev/) - 熟悉 vite 特性
- [Vue3](https://v3.vuejs.org/) - 熟悉 Vue 基础语法
- [TypeScript](https://www.typescriptlang.org/) - 熟悉`TypeScript`基本语法
- [Es6+](http://es6.ruanyifeng.com/) - 熟悉 es6 基本语法
- [Vue-Router-Next](https://next.router.vuejs.org/) - 熟悉 vue-router 基本使用
- [Ant-Design-Vue](https://2x.antdv.com/docs/vue/introduce-cn/) - ui 基本使用
- [Mock.js](https://github.com/nuysoft/Mock) - mockjs 基本语法

## 安装使用

- 获取项目代码

```bash
git clone https://gitee.com/battcn/wemirr-platform-ui.git
```

- 安装依赖

```bash
cd wemirr-platform-ui
# 如果没有 pnpm 请先安装 pnpm
# npm install -g pnpm
pnpm install

```

- 运行

```bash
# 如果您已运行了配套后端, 那么请注释掉
# vite.config.ts  target: "https://cloud.battcn.com/api" 将地址改成 http://localhost:9000
pnpm serve
```

- 打包

```bash
pnpm build
```

## 更新日志

```
当前版本是基于 vben2.10 和 antdv3.x 历史版本请切换 vben2.8
```
