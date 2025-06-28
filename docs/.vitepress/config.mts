import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "糖豆方块屋文档中心",
  description: "一个 VitePress 文档站点",
  themeConfig: {
    logo: 'logo.png',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '介绍', link: '/' },
      { text: '常见问题', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: '示例',
        items: [
          { text: 'Markdown 示例', link: '/markdown-examples' },
          { text: '运行时 API 示例', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/LanYinxianxuan/tdfkw' }
    ]
  }
})
