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
pnpm run dev:antd
```

- 打包

```bash
pnpm build
```

## 版本管理

**项目代码全部开源,非阉割版,有`Spring Cloud` 工作经验的 无需付费协助一样可以玩转项目**

| 版本     | 描述                                                                         |
|--------|----------------------------------------------------------------------------|
| v1-dev | ~~基于 Vue2.x 与 D2admin 进行开发（已废弃/不建议使用）~~                                    |
| v2-dev | 基于 Vue3.x 与 Vben2.x 版本进行开发（~~Vben2.x 官方已停止更新~~）配套 WP 后端 v2-dev / v2-master） |
| v3-dev | 基于 Vue3.x 与 Vben5.x 版本进行开发（强烈推荐,因为作者后期重心在它）                   |
