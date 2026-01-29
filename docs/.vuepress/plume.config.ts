/**
 * 查看以下文档了解主题配置
 * - @see https://theme-plume.vuejs.press/config/intro/ 配置说明
 * - @see https://theme-plume.vuejs.press/config/theme/ 主题配置项
 *
 * 请注意，对此文件的修改不会重启 vuepress 服务，而是通过热更新的方式生效
 * 但同时部分配置项不支持热更新，请查看文档说明
 * 对于不支持热更新的配置项，请在 `.vuepress/config.ts` 文件中配置
 *
 * 特别的，请不要在两个配置文件中重复配置相同的项，当前文件的配置项会覆盖 `.vuepress/config.ts` 文件中的配置
 */

import { defineThemeConfig } from 'vuepress-theme-plume'
import { zhCollections } from './collections'
import { zhNavbar } from './navbar'

/**
 * @see https://theme-plume.vuejs.press/config/theme/
 */
export default defineThemeConfig({
  logo: '/morro.png',  // 导航栏 logo

  appearance: true,  // 配置 深色模式切换（启用深色/浅色模式切换按钮）

  social: [
    { icon: 'fa6-brands:github-alt', link: 'https://github.com/3506897731/Morro_Doc' },
  ],
  navbarSocialInclude: ['fa6-brands:github-alt'], // 允许显示在导航栏的 social 社交链接
  
  aside: true, // 页内侧边栏，默认显示在右侧
  outline: [2, 3], // 页内大纲，默认显示 h2, h3

  /**
   * 文章版权信息
   * @see https://theme-plume.vuejs.press/guide/features/copyright/
   */
  // copyright: true,

  prevPage: false,   // 是否启用上一页链接
  nextPage: false,   // 是否启用下一页链接
  // createTime: true, // 是否显示文章创建时间

  /* 站点页脚 - 设置为 false 禁用页脚 */
  footer: false,

  /* 过渡动画 @see https://theme-plume.vuejs.press/config/theme/#transition */
  // transition: {
  //   page: true,        // 启用 页面间跳转过渡动画
  //   postList: true,    // 启用 博客文章列表过渡动画
  //   appearance: 'fade',  // 启用 深色模式切换过渡动画, 或配置过渡动画类型
  // },

  /**
   * 个人信息配置
   * @see https://theme-plume.vuejs.press/config/theme/#profile
   */
  profile: {
    avatar: '/morro.png',  // 个人主页头像
    name: 'MORRO',
    description: 'My Docs',
    // circle: true,
    // location: '',
    // organization: '',
  },

  navbar: zhNavbar,
  collections: zhCollections,

  /**
   * 公告板
   * @see https://theme-plume.vuejs.press/guide/features/bulletin/
   */
  // bulletin: {
  //   layout: 'top-right',
  //   contentType: 'markdown',
  //   title: '',
  //   content: '',
  // },
})
