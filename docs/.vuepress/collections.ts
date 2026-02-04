/**
 * @see https://theme-plume.vuejs.press/guide/collection/ 查看文档了解配置详情。
 *
 * Collections 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 *
 * 请注意，你应该先在这里配置好 Collections，然后再启动 vuepress，主题会在启动 vuepress 时，
 * 读取这里配置的 Collections，然后在与 Collection 相关的 Markdown 文件中，自动生成 permalink。
 *
 * collection 的  type 为 `post` 时，表示为 文档列表类型（即没有侧边导航栏，有文档列表页）
 * 可用于实现如 博客、专栏 等以文章列表聚合形式的文档集合 （内容相对碎片化的）
 *
 * collection 的 type 为 `doc` 时，表示为文档类型（即有侧边导航栏）
 * 可用于实现如 笔记、知识库、文档等以侧边导航栏形式的文档集合 （内容强关联、成体系的）
 * 如果发现 侧边栏没有显示，那么请检查你的配置是否正确，以及 Markdown 文件中的 permalink
 * 是否是以对应的 Collection 配置的 link 的前缀开头。 是否展示侧边栏是根据 页面链接 的前缀 与 `collection.link`
 * 的前缀是否匹配来决定。
 */

/**
 * 在受支持的 IDE 中会智能提示配置项。
 *
 * - `defineCollections` 是用于定义 collection 集合的帮助函数
 * - `defineCollection` 是用于定义单个 collection 配置的帮助函数
 *
 * 通过 `defineCollection` 定义的 collection 配置，应该填入 `defineCollections` 中
 */
import { defineCollection, defineCollections } from 'vuepress-theme-plume'

/* =================== 文档集合配置 ======================= */

// Interview 左侧导航（全英文、自定义、分组默认折叠）
const interviewSidebar = [
  { text: 'FUNDAMENTALS', 
    link: '/doc/Interview/fundamentals/' ,
    icon: 'lucide:dog',
    collapsed: true,
    items: [
      {
        text: 'Data Engineering',
        link: '/doc/Interview/fundamentals/data-engineering/',
        collapsed: true,
        items: [
          {
            text: 'Storage Layer',
            link: '/doc/Interview/fundamentals/data-engineering/storage/',
          },
          {
            text: 'Compute Layer',
            link: '/doc/Interview/fundamentals/data-engineering/compute/',
          },
          {
            text: 'Query Layer',
            link: '/doc/Interview/fundamentals/data-engineering/query/',
          },
          {
            text: 'Scheduling Layer',
            link: '/doc/Interview/fundamentals/data-engineering/scheduling/',
          },
        ],
      },
      {
        text: 'Access Control',
        link: '/doc/Interview/fundamentals/access-control/',
      },
    ],
  },
  { text: 'FRONTEND',
    link: '/doc/Interview/frontend/',
    icon: 'streamline-flex:allergens-fish',
    collapsed: true,
    items: [
      {
        text: 'Languages',
        link: '/doc/Interview/frontend/language/',
        collapsed: true,
        items: [
          {
            text: 'JavaScript',
            link: '/doc/Interview/frontend/language/javascript/',
          },
          {
            text: 'TypeScript',
            link: '/doc/Interview/frontend/language/typescript/',
          },
        ],
      },
      {
        text: 'Frameworks',
        link: '/doc/Interview/frontend/framework/',
        collapsed: true,
        items: [
          {
            text: 'React',
            link: '/doc/Interview/frontend/framework/React/',
          },
          {
            text: 'Angular',
            link: '/doc/Interview/frontend/framework/Angular/',
          },
          {
            text: 'Next.js',
            link: '/doc/Interview/frontend/framework/Next.js/',
          },
        ],
      },
      {
        text: 'Architecture',
        link: '/doc/Interview/frontend/architecture/',
      },
    ],
  },
  {
    text: 'BACKEND',
    link: '/doc/Interview/backend/',
    icon: 'solar:cat-broken',
    collapsed: true,
    items: [
      { 
        text: 'Languages', 
        link: '/doc/Interview/backend/language/' ,
        collapsed: true,
        items: [
          { text: 'Java', 
            link: '/doc/Interview/backend/language/java/' ,
            collapsed: true,
            items: [
              { text: 'Coding Standards', link: '/doc/Interview/backend/language/java/coding-standards/' },
              { text: 'Java Essentials', link: '/doc/Interview/backend/language/java/essentials/' },
            ],
          },
          {
            text: 'Python',
            link: '/doc/Interview/backend/language/python/',
          },
          {
            text: 'Go',
            link: '/doc/Interview/backend/language/go/',
          },
          {
            text: 'Rust',
            link: '/doc/Interview/backend/language/rust/',
          },
        ],
      },
      {
        text: 'Frameworks',
        link: '/doc/Interview/backend/framework/',
        collapsed: true,
        items: [
          { text: 'Spring Boot', link: '/doc/Interview/backend/framework/spring-boot/' },
        ],
      },
      { 
        text: 'Architecture', 
        link: '/doc/Interview/backend/architecture/',
        collapsed: true,
        items: [
          { text: 'DDD', link: '/doc/Interview/backend/architecture/ddd/' },
        ],
      },
      {
        text: 'Databases',
        link: '/doc/Interview/backend/databases/',
        collapsed: true,
        items: [
          {
            text: 'MySQL',
            link: '/doc/Interview/backend/databases/mysql/',
            collapsed: true,
            items: [
              { text: 'Coding Standards', link: '/doc/Interview/backend/databases/mysql/coding-standards/' },
            ],
          },
          {
            text: 'Redis',
            link: '/doc/Interview/backend/databases/redis/',
          },
          {
            text: 'Elasticsearch',
            link: '/doc/Interview/backend/databases/es/',
          },
          {
            text: 'SQL',
            link: '/doc/Interview/backend/databases/sql/',
          },
        ],
      },
      {
        text: 'API Design',
        link: '/doc/Interview/backend/api/',
        collapsed: true,
        items: [
          {
            text: 'RESTful',
            link: '/doc/Interview/backend/api/restful/',
          },
          {
            text: 'RPC',
            link: '/doc/Interview/backend/api/rpc/',
          },
          {
            text: 'GraphQL',
            link: '/doc/Interview/backend/api/graphql/',
          },
        ],
      },
    ],
  },
  {
    text: 'MOBILE',
    link: '/doc/Interview/mobile/',
    icon: 'ri:cake-3-line',
    collapsed: true,
    items: [
      {
        text: 'Languages',
        link: '/doc/Interview/mobile/language/',
        collapsed: true,
        items: [
          {
            text: 'Dart',
            link: '/doc/Interview/mobile/language/dart/',
          },
        ],
      },
      {
        text: 'Frameworks',
        link: '/doc/Interview/mobile/framework/',
        collapsed: true,
        items: [
          {
            text: 'Flutter',
            link: '/doc/Interview/mobile/framework/flutter/',
          },
        ],
      },
    ],
  },
  { text: 'CLOUD-INFRA-DEVOPS', 
    link: '/doc/Interview/cloud-infra-devops/',
    icon: 'icon-park-outline:rabbit'
  },
]

const interviewCollection = defineCollection({
  type: 'doc',
  dir: 'doc/Interview',
  linkPrefix: '/doc/Interview/',
  title: '面试准备',
  sidebar: interviewSidebar,
})

// Engineer 工程实践文档
const engineerCollection = defineCollection({
  type: 'doc',
  dir: 'doc/Engineer',  // 对应 docs/doc/Engineer/ 文件夹
  linkPrefix: '/doc/Engineer/',  // URL 前缀
  title: '工程实践',
  sidebar: 'auto',  // 默认折叠所有侧边栏组
})

/**
 * 导出所有的 collections
 */
export const zhCollections = defineCollections([
  interviewCollection,
  engineerCollection,
])