import { defineConfig } from 'vitepress'

export default defineConfig({
  srcDir: 'docs',

  title: 'TDFKW 文档中心',
  description: '糖豆方块屋 (TDFKW) — Minecraft 社区服务器官网项目文档',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '开发指南', link: '/guide/getting-started' },
      { text: 'API 参考', link: '/api/overview' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开发指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目结构', link: '/guide/project-structure' },
            { text: '开发手册', link: '/guide/development' },
            { text: '部署指南', link: '/guide/deployment' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '概览', link: '/api/overview' },
            { text: '认证', link: '/api/auth' },
            { text: '用户注册', link: '/api/register' },
            { text: '档案文件', link: '/api/files' },
            { text: '工程项目', link: '/api/projects' },
            { text: '服务器监控', link: '/api/monitor' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LanYinxianxuan/tdfkw' },
    ],

    footer: {
      message: 'MIT Licensed',
      copyright: 'Copyright © 2024–2026 糖豆方块屋',
    },
  },
})
