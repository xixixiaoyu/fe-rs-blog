# Nuxt.js 基础

## Nuxt.js 介绍

### 是什么

- 官网：https://zh.nuxtjs.org/
- GitHub 仓库：https://github.com/nuxt/nuxt.js

Nuxt.js 是一个基于 Vue.js 的服务端渲染应用框架，它可以帮我们轻松的实现同构应用。

通过对客户端/服务端基础架构的抽象组织，Nuxt.js 主要关注的是应用的 UI 渲染。

我们的目标是创建一个灵活的应用框架，你可以基于它初始化新项目的基础结构代码，或者在已有 Node.js 项目中使用 Nuxt.js。

Nuxt.js 预设了利用 Vue.js 开发服务端渲染的应用所需要的各种配置。

除此之外，我们还提供了一种命令叫： nuxt generate ，为基于 Vue.js 的应用提供生成对应的静态站 点的功能。

我们相信这个命令所提供的功能，是向开发集成各种微服务（Microservices）的 Web 应用迈开的新一步。

作为框架，Nuxt.js 为 客户端/服务端 这种典型的应用架构模式提供了许多有用的特性，例如异步数据 加载、中间件支持、布局支持等非常实用的功能。

### 特性

- 基于 Vue.js
  - Vue、Vue Router、Vuex、Vue SSR
- 自动代码分层
- 服务端渲染
- 强大的路由功能，支持异步数据
- 静态文件服务
- ES2015+ 语法支持
- 打包和压缩 JS 和 CSS
- HTML 头部标签管理
- 本地开发支持热加载
- 集成 ESLint
- 支持各种样式预处理器： SASS、LESS、 Stylus 等等
- 支持 HTTP/2 推送

### Nuxt.js 框架是如何运作的

![image-20220112161234577](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220112161234577.png)

Nuxt.js 集成了以下组件/框架，用于开发完整而强大的 Web 应用：

- Vue.js
- Vue Router
- Vuex
- Vue Server Renderer

压缩并 gzip 后，总代码大小为：57kb （如果使用了 Vuex 特性的话为 60kb）。

另外，Nuxt.js 使用 Webpack 和 vue-loader 、 babel-loader 来处理代码的自动化构建工作（如打包、 代码分层、压缩等等）。

### Nuxt 的使用方式

- 初始项目
- 又有的 Node.js 服务端项目
  - 直接把 Nuxt 当作一个中间件集成到 Node Web Server 中
- 现有的 Vue 项目
  - 非常熟悉 Nuxt
  - 至少百分之 10 的代码改动

## 创建项目

Nuxt 提供了两种方式用来创建项目：

- 使用 create-nuxt-app 脚手架工具
- 手动创建

> 为了让大家有一个更好的学习效果，这里我们建议先通过手动创建的方式来学习 Nuxt，熟悉了 Nuxt 的基本能使用之后，我们会在后面的综合案例中学习如何使用 create-nuxt-app 创建项目。

### （1）准备

```shell
# 创建示例项目
mkdir nuxt-app-demo

# 进入示例项目目录中
cd nuxt-app-demo

# 初始化 package.json 文件
npm init -y

# 安装 nuxt
npm innstall nuxt
```

在 package.json 文件的 scripts 中新增：

```json
"scripts": {
    "dev": "nuxt"
}
```

上面的配置使得我们可以通过运行 npm run dev 来运行 nuxt 。

### （2）创建页面并启动项

创建 pages 目录：

```
mkdir pages
```

创建我们的第一个页面 pages/index.vue：

```vue
<template>
  <h1>Hello world!</h1>
</template>
```

然后启动项目：

```
npm run dev
```

现在我们的应用运行在 http://localhost:3000 上运行。

注意：Nuxt.js 会监听 pages 目录中的文件更改，因此在添加新页面时无需重新启动应用程序。

### （3）Nuxt 中的基础路由

Nuxt.js 会依据 pages 目录中的所有 \*.vue 文件生成应用的路由配置。

假设 pages 的目录结构如下：

```json
pages/
--| user/
-----| index.vue
-----| one.vue
--| index.vue
```

那么，Nuxt.js 自动生成的路由配置如下：

```js
router: {
  routes: [
    {
      name: "index",
      path: "/",
      component: "pages/index.vue",
    },
    {
      name: "user",
      path: "/user",
      component: "pages/user/index.vue",
    },
    {
      name: "user-one",
      path: "/user/one",
      component: "pages/user/one.vue",
    },
  ];
}
```

## Nuxt 路由

Nuxt.js 依据 pages 目录结构自动生成 vue-router 模块的路由配置。

### 基础路由

假设 pages 的目录结构如下：

```json
pages/
--| user/
-----| index.vue
-----| one.vue
--| index.vue
```

那么，Nuxt.js 自动生成的路由配置如下：

```js
router: {
  routes: [
    {
      name: "index",
      path: "/",
      component: "pages/index.vue",
    },
    {
      name: "user",
      path: "/user",
      component: "pages/user/index.vue",
    },
    {
      name: "user-one",
      path: "/user/one",
      component: "pages/user/one.vue",
    },
  ];
}
```

### 路由导航

- a 标签

  - 它会刷新整个页面，不推荐使用 `<a href="/">首页</a>`

- 组件

  - `<router-link to="/">首页</router-link>`

- 编程式导航
  - `<button @click="onClick">首页</button>`

### 动态路由

在 Nuxt.js 里面定义带参数的动态路由，需要创建对应的以下划线作为前缀的 Vue 文件 或 目录。 以下目录结构：

```json
pages/
--| _slug/
-----| comments.vue
-----| index.vue
--| users/
-----| _id.vue
--| index.vue
```

Nuxt.js 生成对应的路由配置表为：

```js
router: {
  routes: [
    {
      name: "index",
      path: "/",
      component: "pages/index.vue",
    },
    {
      name: "users-id",
      path: "/users/:id?",
      component: "pages/users/_id.vue",
    },
    {
      name: "slug",
      path: "/:slug",
      component: "pages/_slug/index.vue",
    },
    {
      name: "slug-comments",
      path: "/:slug/comments",
      component: "pages/_slug/comments.vue",
    },
  ];
}
```

你会发现名称为 users-id 的路由路径带有 :id? 参数，表示该路由是可选的。如果你想将它设置为必选的路由，需要在 users/\_id 目录内创建一个 index.vue 文件。

### 嵌套路由

你可以通过 vue-router 的子路由创建 Nuxt.js 应用的嵌套路由。

创建内嵌子路由，你需要添加一个 Vue 文件，同时添加一个与该文件同名的目录用来存放子视图组件。

> Warning: 别忘了在父组件( .vue 文件) 内增加 用于显示子视图内容。

假设文件结构如：

```json
pages/
--| users/
-----| _id.vue
-----| index.vue
--| users.vue
```

Nuxt.js 自动生成的路由配置如下：

```js
router: {
  routes: [
    {
      path: "/users",
      component: "pages/users.vue",
      children: [
        {
          path: "",
          component: "pages/users/index.vue",
          name: "users",
        },
        {
          path: ":id",
          component: "pages/users/_id.vue",
          name: "users-id",
        },
      ],
    },
  ];
}
```

### 路由配置

https://zh.nuxtjs.org/api/configuration-router

## 视图

![image-20220112171438709](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220112171438709.png)

- [视图 - NuxtJS | Nuxt.js 中文网](https://www.nuxtjs.cn/guide/views)

### 1.模板

你可以定制化 Nuxt.js 默认的应用模板。

定制化默认的 html 模板，只需要在 src 文件夹下（默认是应用根目录）创建一个 `app.html` 的文件。

默认模板为：

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

![image-20220113003522906](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220113003522906.png)

#### 2. 结构

Nuxt.js 允许你扩展默认的布局，或在 `layout` 目录下创建自定义的布局。

可通过添加 `layouts/default.vue` 文件来扩展应用的默认布局。

**提示:** 别忘了在布局文件中添加 `<nuxt/>` 组件用于显示页面的主体内容。

默认布局的源码如下：

```html
<template>
  <nuxt />
</template>
```

![在这里插入图片描述](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20200805105851459.png)

![image-20220113003707425](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220113003707425.png)

可以在组件中通过 layout 属性修改默认布局组件：

![image-20220113003747172](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220113003747172.png)

Index 页面的布局组件变成了 foo，但是 about 页面还是 default，因为 about 页面没有修改其 layout 属性，所以默认的布局文件还是 default

### 布局

（1）默认布局

（2）自定义布局

（3）错误页面

### 页面

### HTML 页面头部

（1）默认 Meta 标签

（2）个性化特定页面的 Meta 标签

## 异步数据

### asyncData 方法

Nuxt.js 扩展了 Vue.js，增加了一个叫 `asyncData` 的方法，使得我们可以在设置组件的数据之前能异步获取或处理数据。

基本用法

- 它会将 asyncData 返回的数据融合组件 data 方法返回数据一并给组件
- 调用时机：服务端渲染期间和客户端路由更新之前

注意事项

- 只能在页面组件中使用
- 没有 this，因为它是组件初始化之前被调用

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <nuxt-link to="/about">About</nuxt-link>
    <br />
    <foo :posts="posts" />
  </div>
</template>

<script>
import axios from "axios";
import Foo from "@/components/Foo";

export default {
  name: "HomePage",
  components: {
    Foo,
  },

  // 当你想要动态页面内容有利于 SEO 或者是提升首屏渲染速度的时候，就在 asyncData 中发请求拿数据
  async asyncData() {
    console.log("asyncData");
    console.log(this);
    const res = await axios({
      method: "GET",
      url: "http://localhost:3000/data.json",
    });
    return res.data;
  },

  // 如果是非异步数据或者普通数据，则正常的初始化到 data 中即可
  data() {
    return {
      foo: "bar",
    };
  },
};
</script>

<style></style>
```

### 上下文对象

- [https://zh.nuxtjs.org/guide/async-data#%E4%B8%8A%E4%B8%8B%E6%96%87%E5%AF%B9%E8%B1%A1](https://zh.nuxtjs.org/guide/async-data#上下文对象)

pages/article/\_id.vue

```vue
<template>
  <div>
    <h1>article Page</h1>
    <nuxt-link to="/">首页</nuxt-link>
    <h3>title: {{ post.title }}</h3>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ArticlePage",
  async asyncData(context) {
    // asyncData的参数为上下文对象，我们无法在这个方法里使用this，所以无法通过this.$router.params.id拿到路由参数，但是可以通过context.params.id获取参数
    console.log(context);
    const {
      data: { posts },
    } = await axios({
      method: "GET",
      url: "http://localhost:3000/data.json",
    });
    const id = parseInt(context.params.id, 10);
    return {
      post: posts.find((item) => item.id === id),
    };
  },
};
</script>
```

Components/Foo.vue

```vue
<template>
  <div>
    <h1>Foo</h1>
    <ul>
      <li v-for="item in posts" :key="item.id">
        <nuxt-link :to="'/article/' + item.id">{{ item.title }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FooPage",
  props: ["posts"],
};
</script>

<style scoped></style>
```

pages/index.vue

```vue
<template>
  <div>
    <h1>Hello {{ title }}!</h1>
    <Foo :posts="posts" />
    <nuxt-link to="/about">about</nuxt-link>
  </div>
</template>

<script>
import axios from "axios";
import Foo from "@/components/Foo";

export default {
  name: "HomePage",
  components: {
    Foo,
  },
  async asyncData() {
    // 如果验证asyncData是在服务端执行的？可以通过log输出在了服务端控制台，得出这个方法是在服务端执行的。Nuxtjs为了方便调试，把服务端控制台输出数据也打印在了客户端控制台，但是为了区分，在客户端控制台用“Nuxt SSR”包裹起来了
    console.log("asyncData");
    const res = await axios({
      method: "GET",
      url: "http://localhost:3000/data.json", // 这里的请求地址要写完整，因为在服务端渲染期间，也要来请求数据，不写完整的话服务端渲染就会走到80端口，如果只是客户端渲染，就会以3000端口为基准来请求根目录下的data.json，服务端渲染就默认走到80了
    });
    // 返回的数据会与data中的数据混合
    return res.data;
  },
  data() {
    return {
      foo: "bar",
    };
  },
};
</script>

<style scoped></style>
```

### 错误处理

### 生命周期

![image-20220112174355657](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220112174355657.png)

## 插件

## 模块

## Vuex 状态管理

https://nuxtjs.org/guide/vuex-store

## Nuxt 渲染流程

下图阐述了 Nuxt.js 应用一个完整的服务器请求到渲染（或用户通过切换路由渲染页面）的流程：

![image-20220112180343562](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220112180343562.png)

## Nuxt 常见问题

> https://zh.nuxtjs.org/faq/

## Nuxt 官方示例

> https://zh.nuxtjs.org/example
