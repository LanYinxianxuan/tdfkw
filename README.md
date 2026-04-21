# 糖豆方块屋 (TDFKW)

糖豆方块屋是一个专为 Minecraft 玩家打造的社区服务器官网项目。该项目包含了服务器的信息展示、玩家注册、白名单申请、文档中心等功能。

## 🏗️ 项目结构

本项目采用多部分组成：

- **根目录**: 包含了主要面向用户的静态页面（如 `index.html`, `about.html`, `download.html` 等）。
- **`tdfkw/`**: 基于 **Vue 3 + Vite** 构建的现代化 Web 应用，负责更复杂的交互功能（注册、仪表盘、白名单等）。
- **`docs/`**: 基于 **VitePress** 构建的文档中心。
- **`serve/`**: 后端服务相关的代码。

## 🛠️ 技术栈

### 前端
- **框架**: Vue.js 3 (Composition API)
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由管理**: Vue Router
- **静态文档**: VitePress

### 后端
- **框架**: [Hono](https://hono.dev/) (跑在 Node.js 上)
- **数据库**: SQLite (通过 `better-sqlite3`)
- **开发工具**: tsx, TypeScript

### 代码规范
- ESLint, Prettier, Oxlint

## 🚀 快速开始

### 官网应用 (tdfkw 目录)

如果你想运行 Vue 编写的管理后台/应用部分：

```bash
cd tdfkw
npm install
npm run dev
```

### 文档中心 (docs 目录)

```bash
cd docs
npm install
npm run dev
```

### 后端服务 (serve/my-app 目录)

```bash
cd serve/my-app
npm install
npm run dev
```

## 🎮 服务器信息

- **服务器名称**: 糖豆方块屋
- **连接地址**: `mc.tangdoufangkuaiwu.top`
- **游戏版本**: Minecraft 1.20.4 (Fabric)
- **登录方式**: 外置登录 ([Little Skin](https://littleskin.cn/))

## 🤝 参与开发

如果你有任何建议或想参与开发，可以通过以下方式联系我们：
- **Email**: lanyinxianxuan@163.com
- **GitHub**: [LanYinxianxuan/tdfkw](https://github.com/LanYinxianxuan/tdfkw.git)

## 📄 开源协议

本项目采用 [LICENSE](LICENSE) 中规定的开源协议。

---
版权所有 &copy; 2024–2025 糖豆方块屋
