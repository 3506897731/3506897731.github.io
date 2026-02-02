---
title: MORRO
createTime: 2026/01/29 11:05:23
permalink: /doc/
---

:::: card-grid
::: card title="阿巴阿巴" icon="noto-v1:pouting-cat"

这里是卡片内容。
:::

::: card title="卡片标题 2" icon="noto-v1:cat-with-wry-smile"

这里是卡片内容。
:::
::::


这是带左上角那个叉叉的！
::: demo-wrapper
添加你的示例
:::

tabs和codetabs是有区别的哦
::: code-tabs
@tab pnpm
``` sh
pnpm add -D vuepress vuepress-theme-plume
```
@tab yarn
``` sh
yarn add -D vuepress vuepress-theme-plume
```
@tab npm
``` sh
npm install -D vuepress vuepress-theme-plume
```
:::

下面这个就没有那个图标标

::: tabs
@tab 🐱 npm

npm 应该与 Node.js 被一同安装。

@tab pnpm

代码设置折叠的话，默认是15
```sh :collapsed-lines=10
corepack enable
corepack use pnpm@8
```

:::

==重要内容=={.important} 是一个 ==简洁美观=={.info} 的 主题

::: file-tree icon="simple"
- docs
  - .vuepress
    - config.ts
  - page1.md
  - README.md
- package.json
:::

- [ ] 任务 1[^脚注1]
- [x] 任务 2
- [ ] 任务 3

The HTML specification is maintained by the W3C.

流程图示例哦

```flow
para=>parallel: 平行任务
process=>operation: 操作
e=>end: 结束

para(path1, bottom)->process->e
para(path2)->e
```

plantuml画图详情参考[url](https://theme-plume.vuejs.press/guide/chart/plantuml/)

:::: steps
1. 步骤 1

   ```ts
   console.log('Hello World!')
   ```

2. 步骤 2

   这里是步骤 2 的相关内容

3. 步骤 3

   这里是步骤 2 的相关内容

4. 结束
::::

- [面试准备](/doc/Interview/)
- [工程实践](/doc/Engineer/)

*[HTML]: Hyper **Text** Markup Language
*[W3C]:  World Wide **Web** Consortium

[^脚注1]: 出自 宋·文天祥 **《过零丁洋》**