# Nuxt.js 综合案例

## 1.介绍

基于 RealWorld

- GitHub 仓库：https://github.com/gothinkster/realworld
- 在线示例：https://demo.realworld.io/#/
- 接口文档：https://github.com/gothinkster/realworld/tree/master/api
- 页面模板：https://github.com/gothinkster/realworld-starter-kit/blob/master/FRONTEND_INSTRUCTIONS.md

## 2.项目初始化

### 创建项目

```shell
# 创建项目目录
mkdir realworld-nuxtjs

# 进入项目目录
cd realworld-nuxtjs

# 生成 package.json 文件
npm init -y

# 安装 nuxt 依赖
npm install nuxt
```

在 `package.json` 中添加启动脚本：

```json
"scripts": {
    "dev": "nuxt"
}
```

创建 pages/index.vue ：

```vue
<template>
  <div>
    <h1>Home Page</h1>
  </div>
</template>
<script>
export default {
  name: "HomePage",
};
</script>
<style></style>
```

启动服务：

```shell
npm run dev
```

在浏览器中访问 http://localhost:3000/ 测试。

### 导入样式资源

`app.html` ：

```html
<!DOCTYPE html>
<html {{ HTML_ATTRS }}>
  <head {{ HEAD_ATTRS }}>
    {{ HEAD }}
    <!-- Import Ionicon icons & Google Fonts our Bootstrap theme relies on -->
    <link
      href="https://cdn.jsdelivr.net/npm/ionicons@2.0.1/css/ionicons.min.css"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="//fonts.googleapis.com/css?
family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Sour
ce+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic"
      rel="stylesheet"
      type="text/css"
    />
    <!-- Import the custom Bootstrap 4 theme from our hosted CDN -->
    <!-- <link rel="stylesheet" href="//demo.productionready.io/main.css"> -->
    <link rel="stylesheet" href="/index.css" />
  </head>
  <body {{ BODY_ATTRS }}>
    {{ APP }}
  </body>
</html>
```

### 布局组件

- 重写路由表

`nuxt.config.js`

```js
/**
 * Nuxt.js 配置文件
 */

module.exports = {
  router: {
    linkActiveClass: "active",
    // 自定义路由表规则
    extendRoutes(routes, resolve) {
      // 清除 Nuxt.js 基于 pages 目录默认生成的路由表规则
      routes.splice(0);

      routes.push(
        ...[
          {
            path: "/",
            component: resolve(__dirname, "pages/layout/"),
            children: [
              {
                path: "", // 默认子路由
                name: "home",
                component: resolve(__dirname, "pages/home/"),
              },
              {
                path: "/login",
                name: "login",
                component: resolve(__dirname, "pages/login/"),
              },
              {
                path: "/register",
                name: "register",
                component: resolve(__dirname, "pages/login/"),
              },
              {
                path: "/profile/:username",
                name: "profile",
                component: resolve(__dirname, "pages/profile/"),
              },
              {
                path: "/settings",
                name: "settings",
                component: resolve(__dirname, "pages/settings/"),
              },
              {
                path: "/editor",
                name: "editor",
                component: resolve(__dirname, "pages/editor/"),
              },
              {
                path: "/article/:slug",
                name: "article",
                component: resolve(__dirname, "pages/article/"),
              },
            ],
          },
        ]
      );
    },
  },

  server: {
    host: "0.0.0.0",
    port: 3000,
  },
};
```

`pages/layout/index.vue`

```vue
<template>
  <div>
    <nav class="navbar navbar-light">
      <div class="container">
        <nuxt-link class="navbar-brand" to="/">conduit</nuxt-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <nuxt-link class="nav-link active" to="/">Home</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/editor">
              <i class="ion-compose"></i>&nbsp;New Post
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/settings">
              <i class="ion-gear-a"></i>&nbsp;Settings
            </nuxt-link>
          </li>
          <li class="nav-item">
            登录注册 pages/login.vue
            <nuxt-link class="nav-link" to="/profile/lpz">
              <img
                class="user-pic"
                src="http://toutiao.meiduo.site/FtNcS8sKFSYQbtBbd40eFTL6lAs_"
                ng-src="http://toutiao.meiduo.site/FtNcS8sKFSYQbtBbd40eFTL6lAs_"
              />
              LPZ
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/login"> Sign in </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/register"> Sign up </nuxt-link>
          </li>
        </ul>
      </div>
    </nav>
    <nuxt-child />
    <footer>
      <div class="container">
        <nuxt-link class="logo-font" to="/">conduit</nuxt-link>
        <span class="attribution">
          An interactive learning project from <a href="https://kaiwu.lagou.com/">lagou</a>. Code
          &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>
<script>
export default {
  name: "LayoutIndex",
};
</script>
```

### 登录注册

`pages/login.vue`

```vue
<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            导入剩余页面
            <nuxt-link v-if="isLogin" to="/register">Need an account?</nuxt-link>
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>
          <ul class="error-messages">
            <li>That email is invalid.</li>
          </ul>
          <form>
            <fieldset v-if="!isLogin" class="form-group">
              <input class="form-control form-control-lg" type="text" placeholder="Your Name" />
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="email" placeholder="Email" />
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="password" placeholder="Password" />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LoginIndex",
  asyncData() {},
  data() {
    return {};
  },
  computed: {
    isLogin() {
      return this.$route.path === "/login";
    },
  },
};
</script>
<style></style>
```

### 导入剩余页面

![image-20220112230952749](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220112230952749.png)

### 首页

`pages/home/index.vue`

```vue
<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link disabled" href="">Your Feed</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="">Global Feed</a>
              </li>
            </ul>
          </div>
          <div class="article-preview">
            <div class="article-meta">
              <a href="profile.html"><img src="http://i.imgur.com/Qr71crq.jpg" /> </a>
              <div class="info">
                <a href="" class="author">Eric Simons</a>
                <span class="date">January 20th</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> 29 用户页面
              </button>
            </div>
            <a href="" class="preview-link">
              <h1>How to build webapps that scale</h1>
              <p>This is the description for the post.</p>
              <span>Read more...</span>
            </a>
          </div>
          <div class="article-preview">
            <div class="article-meta">
              <a href="profile.html"><img src="http://i.imgur.com/N4VcUeJ.jpg" /> </a>
              <div class="info">
                <a href="" class="author">Albert Pai</a>
                <span class="date">January 20th</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> 32
              </button>
            </div>
            <a href="" class="preview-link">
              <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
              <p>This is the description for the post.</p>
              <span>Read more...</span>
            </a>
          </div>
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <a href="" class="tag-pill tag-default">programming</a>
              <a href="" class="tag-pill tag-default">javascript</a>
              <a href="" class="tag-pill tag-default">emberjs</a>
              <a href="" class="tag-pill tag-default">angularjs</a>
              <a href="" class="tag-pill tag-default">react</a>
              <a href="" class="tag-pill tag-default">mean</a>
              <a href="" class="tag-pill tag-default">node</a>
              <a href="" class="tag-pill tag-default">rails</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

### 用户管理

`pages/profile/index.vue`

```vue
<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img src="http://i.imgur.com/Qr71crq.jpg" class="user-img" />
            <h4>Eric Simons</h4>
            <p>
              Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda looks like Peeta
              from the Hunger Games
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp; Follow Eric Simons
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link active" href="">My Articles</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="">Favorited Articles</a>
              </li>
            </ul>
          </div>
          <div class="article-preview">
            <div class="article-meta">
              <a href=""><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
              <div class="info">
                <a href="" class="author">Eric Simons</a>
                <span class="date">January 20th</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> 29
              </button>
            </div>
            <a href="" class="preview-link">
              <h1>How to build webapps that scale</h1>
              <p>This is the description for the post.</p>
              <span>Read more...</span>
            </a>
          </div>
          <div class="article-preview">
            <div class="article-meta">
              <a href=""><img src="http://i.imgur.com/N4VcUeJ.jpg" /></a>
              <div class="info">
                <a href="" class="author">Albert Pai</a>
                <span class="date">January 20th</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> 32
              </button>
            </div>
            <a href="" class="preview-link">
              <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
              <p>This is the description for the post.</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li class="tag-default tag-pill tag-outline">Music</li>
                <li class="tag-default tag-pill tag-outline">Song</li>
              </ul>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserProfile",
};
</script>
```

### 用户设置

`pages/setting/index.vue`

```vue
<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of
profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Your Name" />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input class="form-control form-control-lg" type="text" placeholder="Email" />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SettingsIndex",
};
</script>
```

### 创建文章

`pages/editor/index.vue`

```vue
<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="What's this article about?" />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input type="text" class="form-control" placeholder="Enter tags" />
                <div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="button">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditorIndex",
};
</script>

<style></style>
```

### 文章详情

`pages/article/index.vue`

```vue
<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>How to build webapps that scale</h1>
        <div class="article-meta">
          <a href=""><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
          <div class="info">
            <a href="" class="author">Eric Simons</a>
            <span class="date">January 20th</span>
          </div>
          <button class="btn btn-sm btn-outline-secondary">
            <i class="ion-plus-round"></i>
            &nbsp; Follow Eric Simons <span class="counter">(10)</span>
          </button>
          &nbsp;&nbsp;
          <button class="btn btn-sm btn-outline-primary">
            <i class="ion-heart"></i>
            &nbsp; Favorite Post <span class="counter">(29)</span>
          </button>
        </div>
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <p>
            Web development technologies have evolved at an incredible clip over the past few years.
          </p>
          <h2 id="introducing-ionic">Introducing RealWorld.</h2>
          <p>It's a great solution for learning how other frameworks work.</p>
        </div>
      </div>
      <hr />
      <div class="article-actions">
        <div class="article-meta">
          <a href="profile.html"><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
          <div class="info">
            <a href="" class="author">Eric Simons</a>
            <span class="date">January 20th</span>
          </div>
          <button class="btn btn-sm btn-outline-secondary">
            <i class="ion-plus-round"></i>
            &nbsp; Follow Eric Simons <span class="counter">(10)</span>
          </button>
          &nbsp;
          <button class="btn btn-sm btn-outline-primary">
            <i class="ion-heart"></i>
            &nbsp; Favorite Post <span class="counter">(29)</span>
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form class="card comment-form">
            <div class="card-block">
              <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
            </div>
            <div class="card-footer">
              <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
              <button class="btn btn-sm btn-primary">Post Comment</button>
            </div>
          </form>
          <div class="card">
            <div class="card-block">
              <p class="card-text">
                With supporting text below as a natural lead-in to additional content.
              </p>
            </div>
            <div class="card-footer">
              <a href="" class="comment-author">
                <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
              </a>
              &nbsp;
              <a href="" class="comment-author">Jacob Schmidt</a>
              <span class="date-posted">Dec 29th</span>
            </div>
          </div>
          <div class="card">
            <div class="card-block">
              <p class="card-text">
                With supporting text below as a natural lead-in to additional content.
              </p>
            </div>
            <div class="card-footer">
              <a href="" class="comment-author">
                <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
              </a>
              &nbsp;
              <a href="" class="comment-author">Jacob Schmidt</a>
              <span class="date-posted">Dec 29th</span>
              <span class="mod-options">
                <i class="ion-edit"></i>
                <i class="ion-trash-a"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticleIndx",
};
</script>
```

### 处理顶部导航链接

```vue
<template>
  <div>
    <!-- 顶部导航栏 -->
    <nav class="navbar navbar-light">
      <div class="container">
        <!-- <a class="navbar-brand" href="index.html">conduit</a> -->
        <nuxt-link class="navbar-brand" to="/">Home</nuxt-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <!-- <a class="nav-link active" href="">Home</a> -->
            <nuxt-link class="nav-link active" to="/">Home</nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/editor">
              <i class="ion-compose"></i>&nbsp;New Post
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/settings">
              <i class="ion-gear-a"></i>&nbsp;Settings
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/login"> Sign in </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/register"> Sign up </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link class="nav-link" to="/profile/123">
              <img class="user-pic" src="http://i.imgur.com/N4VcUeJ.jpg" />
              lpz999
            </nuxt-link>
          </li>
        </ul>
      </div>
    </nav>
    <!-- /顶部导航栏 -->
    <!-- 子路由 -->
    <nuxt-child />
    <!-- /子路由 -->
    <!-- 底部 -->
    <footer>
      <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code
          &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
    <!-- /底部 -->
  </div>
</template>
<script>
export default {
  name: "LayoutIndex",
};
</script>
<style></style>
```

### 封装请求模块

安装 axios：

```shell
npm i axios
```

`utils/request.js`

```js
/**
 * 基于axios封装的请求模块
 */

import axios from "axios";

const request = axios.create({
  baseURL: "https://conduit.productionready.io",
});

// 请求拦截器

// 响应拦截器
export default request;
```

## 3.登录注册

### 封装登录方法

`api/user.js`

```js
import request from "@/utils/request";

// 用户登录
export const login = (data) => {
  return request({
    method: "POST",
    url: "/api/users/login",
    data,
  });
};

// 用户注册
export const register = (data) => {
  return request({
    method: "POST",
    url: "/api/users",
    data,
  });
};
```

`pages/login/index.vue`

```js
import { login } from "@/api/user";
export default {
  name: "LoginPage",
  computed: {
    isLogin() {
      return this.$route.name === "login";
    },
  },
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async onSubmit() {
      // 提交表单，请求登录
      const { data } = await login({
        user: this.user,
      });
      console.log("data", data);
      // TODO 保存用户的登录状态

      // 跳转到首页
      this.$router.push("/");
    },
  },
};
```

### 错误处理

data 中存放`errors: {} // 错误信息`

改写 onSubmit 方法(try-catch 捕获错误)：

```js
async onSubmit () {
  try {
    // 提交表单，请求登录
    const { data } = await login({
      user: this.user
    })
    console.log('data', data)
    // TODO 保存用户的登录状态

    // 跳转到首页
    this.$router.push('/')
  }
  catch (err) {
    console.log('请求失败', err)
    console.dir(err)
    this.errors = err.response.data.errors
  }
}
```

遍历错误信息：

```html
<ul class="error-messages">
  <template v-for="(messages, field) in errors">
    <li v-for="(message, index) in messages" :key="index">{{ field }} {{ messages}}</li>
  </template>
</ul>
```

### 注册

```js
data () {
  return {
    user: {
      username: '',
      email: '',
      password: ''
    },
    errors: {} // 错误信息
  }
},
methods: {
    async onSubmit () {
      try {
        // 提交表单，请求登录
        const { data } = this.isLogin ? await login({
          user: this.user
        }): await register({
          user: this.user
        })
        console.log('data', data)
        // TODO 保存用户的登录状态

        // 跳转到首页
        this.$router.push('/')
      }
      catch (err) {
        console.log('请求失败', err)
        console.dir(err)
        this.errors = err.response.d ata.errors
      }
    }
}
```

### 解析存储登录状态实现流程

> https://zh.nuxtjs.org/examples/auth-external-jwt
>
> https://codesandbox.io/s/github/nuxt/nuxt.js/tree/dev/examples/auth-jwt?from-embed=&file=/store/index.js

### 将登录状态存储到容器中

`store/index.js`

```js
// 为了防止在服务端渲染期间，运行的都是同一个实例，防止数据冲突，务必要把state定义成一个函数，返回数据对象
export const state = () => {
  return {
    user: null,
  };
};

export const mutations = {
  setUser(state, data) {
    state.user = data;
  },
};

export const actions = {};
```

登录成功时保存用户状态到容器中，`login/index.vue`

```js
// 保存用户的登录状态
this.$store.commit("setUser", data.user);
```

### 登录状态持久化

将数据存到 store 中，只是在内存里，页面一刷新就没了。所以我们应该想办法将数据进行持久化。以前的做法是存到本地存储里，而现在在服务端也要渲染，所以不可以存在本地存储，否则服务端获取不到。正确的做法是存在 cookie 中，cookie 可以随着 http 请求发送到服务端。

所以在`login/index.vue`页面中容器保存完登录状态后，还要将数据存储到 Cookie 中

```js
// 仅在客户端加载js-cookie
const Cookie = process.client ? require("js-cookie") : undefined;

// ...

// 保存用户的登录状态
this.$store.commit("setUser", data.user);

// 为了防止刷新页面数据丢失，数据需要持久化
Cookie.set("user", data.user);
```

在 Store/index.js 的`actions`中增加`nuxtServerInit`方法，`nuxtServerInit`是一个特殊的`action`方法，这个方法会在服务端渲染期间自动调用，作用是初始化容器数据，传递数据给客户端使用

```js
export const actions = {
  nuxtServerInit({ commit }, { req }) {
    let user = null;
    // 如果请求头中有个Cookie
    if (req.headers.cookie) {
      // 使用Cookieparser把cookie字符串转化为JavaScript对象
      const parsed = cookieparser.parse(req.headers.cookie);
      try {
        user = JSON.parse(parsed.user);
      } catch (err) {
        // No valid cookie found
      }
    }
    commit("setUser", user);
  },
};
```

### 处理导航栏链接展示状态

Layout/index.vue 页面中，增加计算属性 user，通过 user 判断用户是否是登录状态：

```js
import { mapState } from "vuex";

export default {
  name: "LayoutIndex",
  computed: {
    ...mapState(["user"]),
  },
};
```

然后将导航栏上的用户名称那个`li`调到登录注册的`li`前面去，将最后两个`li`套在`template`里，将另 3 个`li`套在另外一个`template`里，如果用户登录了，则显示第一个`template`，如果未登录则显示后面两个登录注册所在的`template`

![image-20220113231945363](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220113231945363.png)

### 处理页面访问权限 – 中间件

https://zh.nuxtjs.org/guide/routing#%E4%B8%AD%E9%97%B4%E4%BB%B6

中间件允许您定义一个自定义函数运行在一个页面或一组页面渲染之前。

每一个中间件应放置在 `middleware/` 目录。文件名的名称将成为中间件名称(middleware/auth.js 将成为 auth 中间件)。

然后给要保护的页面增加 middleware 属性，值为中间件的文件名

中间件执行流程顺序：

nuxt.config.js
匹配布局
匹配页面
定义两个中间件，

定义两个中间件，

`middleware/authenticated.js`

```js
export default function ({ store, redirect }) {
  // 如果用户未登录，则跳转到登录页
  if (!store.state.user) {
    return redirect("/login");
  }
}
```

`middleware/notAuthenticated.js`

```js
export default function ({ store, redirect }) {
  // 如果用户已登录，则跳转到首页
  if (store.state.user) {
    return redirect("/");
  }
}
```

然后给`settings/index.vue`、`profile/index.vue`、`editor/index`页面增加属性`middleware`值为`authenticated`

```js
export default {
  name: "Settings",
  middleware: "authenticated",
};
```

给`login/index.vue`页面增加属性`middleware`值为`notAuthenticated`

```js
export default {
  name: "LoginPage",
  middleware: "notAuthenticated",
  // ...
};
```

## 4.首页

首页展示我的关注的文章和公共文章，所有文章可以选择标签，还可以分页。

### 展示公共文章列表

`Api/article.js`

```js
import request from "@/utils/request";

// 获取公共的文章列表
export const getArticles = (params) => {
  return request({
    method: "GET",
    url: "/api/articles",
    params,
  });
};
```

为了更好地优化 SEO，将数据渲染放到服务端进行，数据初始化代码写到`asyncData ()`函数中，循环渲染文章信息。

`home/index.vue`

```html
<div class="article-preview" v-for="article in articles" :key="article.slug">
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
          name: 'profile',
          params: {
            username: article.author.username
          }
        }"
        class="author"
        >{{article.author.username}}</nuxt-link
      >
      <span class="date">{{article.createAt}}</span>
    </div>
    <button
      class="btn btn-outline-primary btn-sm pull-xs-right"
      :class="{active: article.favorited}"
    >
      <i class="ion-heart"></i> {{article.favoritesCount}}
    </button>
  </div>
  <nuxt-link
    :to="{
    name: 'article',
    params: {
      slug: article.slug
    }
  }"
    class="preview-link"
  >
    <h1>{{article.title}}</h1>
    <p>{{article.description}}</p>
    <span>Read more...</span>
  </nuxt-link>
</div>
```

```js
import { getArticles } from "@/api/article";
export default {
  name: "HomePage",
  async asyncData() {
    const { data } = await getArticles();
    return {
      articles: data.articles,
      articlesCount: data.articlesCount,
    };
  },
};
```

### 列表分页

分页参数的使用

```js
async asyncData () {
  const page = 1
  const limit = 2
  const { data } = await getArticles({
    limit,
    offset: (page - 1) * limit
  })
  return {
    articles: data.articles,
    articlesCount: data.articlesCount
  }
}
```

`limit`表示每次展示多少条，`offset`表示跳过前多少条。所以当点击了页码为`page`时，`offset`则为`(page - 1) * limit`

分页处理

```html
<!-- 分页 -->
<nav>
  <ul class="pagination">
    <li class="page-item" :class="{active: item === page}" v-for="item in totalPage" :key="item">
      <nuxt-link
        class="page-link"
        :to="{
                                        name: 'home',
                                        query: {
                                        	page: item
                                        }
                                        }"
        >{{item}}</nuxt-link
      >
    </li>
  </ul>
</nav>
```

```js
import { getArticles } from "@/api/article";
export default {
  name: "HomePage",
  watchQuery: ["page"],
  async asyncData({ query }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 20;
    const { data } = await getArticles({
      limit,
      offset: (page - 1) * limit,
    });
    return {
      limit,
      page,
      articles: data.articles,
      articlesCount: data.articlesCount,
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
};
```

通过计算属性 totalPage 获取到总页面数。asyncData 服务端渲染时通过 URL 上的 query 中的 page 参数获取到页码。

循环生成的页码标签使用 nuxt-link 标签，在客户端进行路由切换。而在前端路由变化之前，会执行 asyncData 方法更新数据。但是 Nuxt 中默认情况下 query 参数的变化不能引起 asyncData 代码的执行，所以我们可以通过使用 watchQuery 参数监听到路由的变化，触发 asyncData 的调用。

https://zh.nuxtjs.org/api/pages-watchquery

使用`watchQuery`属性可以监听参数字符串的更改。 如果定义的字符串发生变化，将调用所有组件方法(asyncData, fetch, validate, layout, …)。 为了提高性能，默认情况下禁用。

```js
export default {
  watchQuery: ["page"],
};
```

### 文章便签列表

`api/tag.js`

```js
import request from "@/utils/request";

// 获取文章标签列表
export const getTags = () => {
  return request({
    method: "GET",
    url: "/api/tags",
  });
};
```

`pages/home/index.vue`

```html
<div class="tag-list">
  <a href="" class="tag-pill tag-default" v-for="item in tags" :key="item">{{item}}</a>
</div>
```

```js
import { getArticles } from "@/api/article";
import { getTags } from "@/api/tag";
export default {
  name: "HomePage",
  watchQuery: ["page"],
  async asyncData({ query }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 20;
    const { data } = await getArticles({
      limit,
      offset: (page - 1) * limit,
    });
    const { data: tagData } = await getTags();
    return {
      limit,
      page,
      articles: data.articles,
      articlesCount: data.articlesCount,
      tags: tagData.tags,
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
};
```

### 优化并行异步任务

将两个没有依赖关系的异步任务通过使用`Promise.all`并行执行，提高请求速度。并发执行的速度大于串行执行的速度。

```js
import { getArticles } from "@/api/article";
import { getTags } from "@/api/tag";
export default {
  name: "HomePage",
  watchQuery: ["page"],
  async asyncData({ query }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 20;
    const [articleRes, tagRes] = await Promise.all([
      getArticles({
        limit,
        offset: (page - 1) * limit,
      }),
      getTags(),
    ]);
    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;
    return {
      limit,
      page,
      articles,
      articlesCount,
      tags,
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
};
```

### 处理标签列表链接和数据

```html
<!-- 分页 -->
<nav>
  <ul class="pagination">
    <li class="page-item" :class="{active: item === page}" v-for="item in totalPage" :key="item">
      <nuxt-link
        class="page-link"
        :to="{
                                              name: 'home',
                                              query: {
                                              	page: item,
                                              tag: $route.query.tag
                                              }
                                              }"
        >{{item}}</nuxt-link
      >
    </li>
  </ul>
</nav>

<div class="tag-list">
  <nuxt-link
    :to="{
                    name: 'home',
                    query: {
                    	tag: item
                    }
                    }"
    class="tag-pill tag-default"
    v-for="item in tags"
    :key="item"
    >{{item}}</nuxt-link
  >
</div>
```

```js
watchQuery: ['page', 'tag'],// 此处监听query中tag变化

// ...


getArticles({
    limit,
    offset: (page - 1) * limit,
    tag: query.tag, // 此处增加tag参数
  }),
```

### 处理文章导航选项卡

```html
<ul class="nav nav-pills outline-active">
  <li v-if="user" class="nav-item" :class="{active: tab === 'your_feed'}">
    <nuxt-link
      class="nav-link"
      :to="{
                        name: 'home',
                        query: {
                            tab: 'your_feed'
                        }
                        }"
      exact
      >Your Feed</nuxt-link
    >
  </li>
  <li class="nav-item" :class="{active: tab === 'global_feed'}">
    <nuxt-link
      class="nav-link"
      :to="{
                        	name: 'home'
                        }"
      exact
      >Global Feed</nuxt-link
    >
  </li>
  <li v-if="tag" class="nav-item" :class="{active: tab === 'tag'}">
    <nuxt-link
      class="nav-link"
      :to="{
                        name: 'home',
                        query: {
                            tab: 'tag',
                            tag: tag
                        }
                        }"
      exact
    >
      # {{ tag }}</nuxt-link
    >
  </li>
</ul>

<div class="tag-list">
  <nuxt-link
    :to="{
                    name: 'home',
                    query: {
                        tag: item,
                        tab: 'tag'
                    }
                    }"
    class="tag-pill tag-default"
    v-for="item in tags"
    :key="item"
    >{{item}}</nuxt-link
  >
</div>
```

```js
import { getArticles } from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from "vuex";
export default {
  name: "HomePage",
  watchQuery: ["page", "tag", "tab"], // 这里增加了tab的监听
  async asyncData({ query }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 20;
    const tab = query.tab || "global_feed"; // 将tab存到data里
    const tag = query.tag; // 将tag存到data里
    const [articleRes, tagRes] = await Promise.all([
      getArticles({
        limit,
        offset: (page - 1) * limit,
        tag: query.tag,
      }),
      getTags(),
    ]);
    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;
    return {
      limit,
      page,
      articles,
      articlesCount,
      tags,
      tab,
      tag,
    };
  },
  computed: {
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
    ...mapState(["user"]), // 用来判断用户是否登录
  },
};
```

### 展示用户关注的文章列表

`Api/article.js`

```js
// 获取用户关注的文章列表
export const getYourFeedArticles = (params) => {
  return request({
    headers: {
      // 添加用户身份，数据格式：Token空格Token数据
      Authorization:
        "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTA4NjU2LCJ1c2VybmFtZSI6ImppYWlsaW5nIiwiZXhwIjoxNjAyMDcyNDkyfQ.Uoz9baKbVzE8oDpLFzAsmhdIPqLnfDCLmEzU7A8Cfog",
    },
    method: "GET",
    url: "/api/articles/feed",
    params,
  });
};
```

pages/home/index.vue 改写部分

```js
const loadArticles = tab !== "your_feed" ? getArticles : getYourFeedArticles;
const [articleRes, tagRes] = await Promise.all([
  loadArticles({
    limit,
    offset: (page - 1) * limit,
    tag: query.tag,
  }),
  getTags(),
]);
```

### 统一设置用户 Token

axios 请求拦截器：

https://github.com/axios/axios#interceptors

Nuxt 中间件：

[https://zh.nuxtjs.org/guide/plugins#%E6%B3%A8%E5%85%A5-context](https://zh.nuxtjs.org/guide/plugins#注入-context)

新建文件`plugins/request.js`

```js
/**
 * 基于axios封装的请求模块
 */

import axios from "axios";

// 创建请求对象
export const request = axios.create({
  baseURL: "https://conduit.productionready.io",
});

// 通过插件机制获取到上下文对象（query、params、req、res、app、store···）
// 插件导出函数必须作为default成员
export default ({ store }) => {
  // 请求拦截器
  // Add a request interceptor
  // 任何请求都要经过请求拦截器
  // 我们可以在请求拦截器中做一些公共的业务处理，例如统一设置Token
  request.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      // 请求就会经过这里
      const { user } = store.state;
      if (user && user.token) config.headers.Authorization = `Token ${user.token}`;
      // 返回config请求配置对象
      return config;
    },
    function (error) {
      // 如果请求失败（此时请求还没有发出去）就会进入这里
      // Do something with request error
      return Promise.reject(error);
    }
  );
};
```

在 Nuxt 配置文件中注册插件：

`Nuxt.config.js`

```js
module.exports = {
  // 注册插件
  plugins: [
    "~/plugins/request.js", // 波浪线开头表示从根路径触发
  ],
};
```

删除原本的`utils/request.js`文件

将原本`api`文件夹里的文件引用的`utils/request.js`文件全部改为`plugins/request.js`

### 文章发布时间格式设置

Dayjs 是一种更轻量级的日期插件，跟 Moment 的 API 用法相同，包含 Moment 最核心的功能。

Dayjs 的 GitHub 仓库地址：https://github.com/iamkun/dayjs/blob/dev/docs/zh-cn/README.zh-CN.md

在 dayjs 官网上查看日期格式：https://day.js.org/docs/en/display/format

安装：`npm i dayjs`

新建文件`plugins/dayjs.js`

```js
import Vue from "vue";
import dayjs from "dayjs";

// {{ 表达式 | 过滤器 }}
Vue.filter("date", (value, format = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs(value).format(format);
});
```

去 nuxt.config.js 里面注册 date 过滤器插件

```js
module.exports = {
  // ...

  // 注册插件
  plugins: [
    "~/plugins/request.js", // 波浪线开头表示从根路径触发
    "~/plugins/dayjs.js",
  ],
};
```

对 page/home/index.vue 里面的日期使用过滤器

```js
<span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
```

#### 文章点赞

`Api/article.js`增加两个按需导出的方法，处理文章点赞和取消点赞功能

```js
// 添加点赞
export const addFavorite = (slug) => {
  return request({
    method: "POST",
    url: `/api/articles/${slug}/favorite`,
  });
};

// 取消点赞
export const deleteFavorite = (slug) => {
  return request({
    method: "DELETE",
    url: `/api/articles/${slug}/favorite`,
  });
};
```

视图中的 button 按钮增加点击事件：

```html
<button
  class="btn btn-outline-primary btn-sm pull-xs-right"
  :class="{active: article.favorited}"
  @click="onFavorite(article)"
  :disabled="article.favoriteDisabled"
>
  <i class="ion-heart"></i> {{article.favoritesCount}}
</button>
```

在 methods 中实现 onFavorite(article)函数

```js
import { getArticles, getYourFeedArticles, addFavorite, deleteFavorite } from "@/api/article";
```

```js
// 主动给article增加一个favoriteDisabled属性，用来控制用户无法频繁点击，避免因为网络原因导致视图和数据库的点赞数不一致。下面这句话写在asyncData方法的return之前。
articles.forEach((article) => (article.favoriteDisabled = false));
```

```js
methods: {
  async onFavorite (article) {
    article.favoriteDisabled = true // 禁用点击
    if(article.favorited) {
      // 取消点赞
      await deleteFavorite(article.slug)
      article.favorited = false
      article.favoritesCount -= 1
    } else {
      // 添加点赞
      await addFavorite(article.slug)
      article.favorited = true
      article.favoritesCount += 1
    }
    article.favoriteDisabled = false // 允许点击
  }
}
```

## 5.文章详情

展示文章详情内容、关注作者、点赞和取消点赞、评论功能

### 展示文章基本信息

在`api/article.js`中增加一个获取文章详情的方法

```js
// 获取文章详情
export const getArticle = (slug) => {
  return request({
    method: "GET",
    url: `/api/articles/${slug}`,
  });
};
```

`pages/article/index.vue`

```js
import { getArticle } from "@/api/article";
export default {
  name: "ArticleIndx",
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug);
    return {
      article: data.article,
    };
  },
};
```

```html
<h1>{{article.title}}</h1>
<div class="row article-content">
  <div class="col-md-12">{{ article.body }}</div>
</div>
```

### 文章详情 - markdown 转 HTML

可以使用 slug 为`markdown-ddof1g`的文章测试

先安装处理 markdown 的依赖 markdown-it

`npm i markdown-it`

然后 new 一个 MarkdownIt 的实例，使用实例的 render 方法转化 markdown 为 HTML

```js
import MarkdownIt from "markdown-it";
import { getArticle } from "@/api/article";
export default {
  name: "ArticleIndx",
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug);
    const { article } = data;
    const md = new MarkdownIt();
    article.body = md.render(article.body);
    return {
      article: article,
    };
  },
};
```

html 文本要用 v-html 标签渲染

```html
<div class="row article-content">
  <div class="col-md-12" v-html="article.body"></div>
</div>
```

### 展示文章作者相关信息

`Pages/article/components/article-meta.vue`

```html
<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        :to="{
      name: 'profile',
      params: {
        username: article.author.username
      }
    }"
        class="author"
        >{{article.author.username}}</nuxt-link
      >
      <span class="date">{{article.createdAt | date('MMM DD, YYYY')}}</span>
    </div>

    <button class="btn btn-sm btn-outline-secondary" :class="{active: article.author.following}">
      <i class="ion-plus-round"></i>
      &nbsp; Follow Eric Simons <span class="counter">(10)</span>
    </button>
    &nbsp;
    <button class="btn btn-sm btn-outline-primary" :class="{active: article.favorited}">
      <i class="ion-heart"></i>
      &nbsp; Favorite Post <span class="counter">({{article.favoritesCount}})</span>
    </button>
  </div>
</template>

<script>
  export default {
    name: "ArticleMeta",
    props: {
      article: {
        type: Object,
        required: true,
      },
    },
  };
</script>
```

`pages/article/index.vue`

```html
<ArticleMeta :article="article" />
```

### 设置页面 meta 的 SEO 优化

https://zh.nuxtjs.org/guide/views#html-%E5%A4%B4%E9%83%A8

https://zh.nuxtjs.org/guide/views#%E4%B8%AA%E6%80%A7%E5%8C%96%E7%89%B9%E5%AE%9A%E9%A1%B5%E9%9D%A2%E7%9A%84-meta-%E6%A0%87%E7%AD%BE

Nuxt 在 head 方法里可通过 this 关键字来获取组件的数据，你可以利用页面组件的数据来设置个性化的 meta 标签。

注意：为了避免子组件中的 meta 标签不能正确覆盖父组件中相同的标签而产生重复的现象，建议利用 hid 键为 meta 标签配一个唯一的标识编号。请阅读关于 vue-meta 的更多信息。

Pages/article/index.vue

```js
head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.article.description
        }
      ]
    }
  }
```

### 通过客户端渲染展示评论列表

`Api/article.js`里增加获取文章评论的方法

```js
// 获取文章评论
export const getComments = (slug) => {
  return request({
    method: "GET",
    url: `/api/articles/${slug}/comments`,
  });
};
```

`pages/article/components/article-comment.vue`

```html
<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
        <button class="btn btn-sm btn-primary">Post Comment</button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">{{comment.body}}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }"
          class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
          name: 'profile',
          params: {
            username: comment.author.username
          }
        }"
          class="comment-author"
          >{{comment.author.username}}</nuxt-link
        >
        <span class="date-posted">{{comment.createdAt | date('MMM DD, YYYY')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { getComments } from "@/api/article";
  export default {
    name: "ArticleComment",
    props: {
      article: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        // 文章列表
        comments: [],
      };
    },
    async mounted() {
      // 不要求SEO，请求数据放到mounted里面，只走客户端渲染
      const { data } = await getComments(this.article.slug);
      this.comments = data.comments;
    },
  };
</script>
```

`pages/article/index.vue`

```html
<ArticleComment :article="article" />
```

### 登录才能评论

`pages/article/index.vue`

```html
<div class="col-xs-12 col-md-8 offset-md-2">
  <ArticleComment v-if="user" :article="article" />
  <ArticlelUnlogin v-else />
</div>
```

```js
import { mapState } from "vuex";
import ArticleUnlogin from "./components/article-unlogin";

export default {
  // ...
  components: {
    // ...
    ArticleUnlogin,
  },
  // ...
  computed: {
    ...mapState(["user"]),
  },
};
```

`pages/article/components/article-unlogin.vue`

```html
<template>
  <div>
    <div class="col-xs-12 col-md-8 offset-md-2">
      <div show-authed="true" style="display: none;">
        <list-errors from="$ctrl.commentForm.errors" class="ng-isolate-scope"
          ><ul class="error-messages ng-hide" ng-show="$ctrl.errors">
            <!-- ngRepeat: (field, errors) in $ctrl.errors -->
          </ul>
        </list-errors>
        <form class="card comment-form ng-pristine ng-valid" ng-submit="$ctrl.addComment()">
          <div class="card-block">
            <textarea
              class="form-control ng-pristine ng-untouched ng-valid ng-empty"
              placeholder="Write a comment..."
              rows="3"
              ng-model="$ctrl.commentForm.body"
            >
            </textarea>
          </div>
          <div class="card-footer">
            <img class="comment-author-img" />
            <button class="btn btn-sm btn-primary" type="submit">Post Comment</button>
          </div>
        </form>
      </div>

      <p show-authed="false" style="display: inherit;">
        <nuxt-link to="/login">Sign in</nuxt-link> or
        <nuxt-link to="/register">sign up</nuxt-link> to add comments on this article.
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ArticleUnlogin",
  };
</script>
```

### 发表评论

`pages/article/components/article-comment.vue`

```html
<form class="card comment-form">
  <div class="card-block">
    <textarea
      class="form-control"
      placeholder="Write a comment..."
      rows="3"
      v-model="body"
    ></textarea>
  </div>
  <div class="card-footer">
    <img :src="user.image" class="comment-author-img" />
    <button class="btn btn-sm btn-primary" @click.prevent="submitComment">Post Comment</button>
  </div>
</form>
```

```js
import { getComments, addComment } from "@/api/article";

export default {
  data() {
    return {
      // ...
      body: "",
    };
  },
  // ...
  methods: {
    async submitComment() {
      const { data } = await addComment(this.article.slug, this.body);
      this.comments.unshift(data.comment);
      this.body = "";
    },
  },
};
```

`api/article.js`

```js
// 评论文章
export const addComment = (slug, body) => {
  return request({
    method: "POST",
    url: `/api/articles/${slug}/comments`,
    data: { body },
  });
};
```

### 添加文章

`pages/editor/index.vue`

```vue
<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages" v-if="errors">
            <div v-for="(value, field) in errors" :key="field" class="ng-scope">
              <li v-for="error in value" :key="error" class="ng-binding ng-scope">
                {{ field }} {{ error }}
              </li>
            </div>
          </ul>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="article.body"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tagstr"
                  v-on:keyup.enter="enterTag"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                />
                <div class="tag-list">
                  <span
                    v-for="(tag, index) in article.tagList"
                    :key="index"
                    class="tag-default tag-pill"
                  >
                    <i class="ion-close-round" @click="removeTag(index)"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                @click="submitArticle"
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createArticle } from "@/api/editor";

export default {
  name: "EditorIndex",
  middleware: "authenticated",
  data() {
    return {
      tagstr: "",
      errors: null,
      article: {
        title: "",
        description: "",
        body: "",
        tagList: [],
      },
    };
  },
  methods: {
    enterTag() {
      this.article.tagList.push(this.tagstr);
      this.tagstr = "";
    },
    removeTag(index) {
      this.article.tagList.splice(index, 1);
    },
    async submitArticle() {
      try {
        const { data } = await createArticle(this.article);
        this.$router.push(`/article/${data.article.slug}`);
      } catch (e) {
        this.errors = e.response.data.errors;
      }
    },
  },
};
</script>
```

`api/editor.js`

```js
import { request } from "@/plugins/request";

// 发表文章
export const createArticle = (data) => {
  return request({
    method: "POST",
    url: "/api/articles",
    data,
  });
};
```

### 本人的文章详情页显示修改按钮和删除按钮

![image-20220114161534319](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220114161534319.png)

注意：修改文章的路由表里要配:slug,否则 slug 无法显示到路由上，slug 后面要加问号，否则添加文章的页面无法访问了

```js
{
  path: '/editor/:slug?',
    name: 'editor',
      component: resolve(__dirname, 'pages/editor')
},
```

`pages/article/components/article-meta.vue`

```html
<span v-if="!user">
  <button class="btn btn-sm btn-outline-secondary" :class="{ active: article.author.following }">
    <i class="ion-plus-round"></i>
    &nbsp; Follow Eric Simons <span class="counter">(10)</span>
  </button>
  &nbsp;
  <button class="btn btn-sm btn-outline-primary" :class="{ active: article.favorited }">
    <i class="ion-heart"></i>
    &nbsp; Favorite Post
    <span class="counter">({{ article.favoritesCount }})</span>
  </button>
</span>
<span v-else>
  <nuxt-link
    class="btn btn-outline-secondary btn-sm"
    :to="{
                    name: 'editor',
                    params: {
                    	slug: article.slug,
                    },
                    }"
  >
    <i class="ion-edit"></i> Edit Article
  </nuxt-link>

  <button
    class="btn btn-outline-danger btn-sm"
    :class="{ disabled: article.isDeleting }"
    @click="handleDelete(article)"
  >
    <i class="ion-trash-a"></i> Delete Article
  </button>
</span>
```

```js
import { mapState } from "vuex";
import { deleteArticle } from "@/api/article";
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    async handleDelete(article) {
      this.article.isDeleting = true;
      await deleteArticle(article.slug);
      this.article.isDeleting = false;
      this.$router.push("/");
    },
  },
};
```

`api/article.js`

```js
// 删除文章
export const deleteArticle = (slug) => {
  return request({
    method: "DELETE",
    url: `/api/articles/${slug}`,
  });
};

// 更新文章详情
export const updateArticle = (slug, data) => {
  return request({
    method: "PUT",
    url: `/api/articles/${slug}`,
    data,
  });
};
```

### 修改文章与添加文章共用一个路由和页面

`pages/editor/index.vue`

```js
import { createArticle, getArticle, updateArticle } from "@/api/article";

export default {
  name: "EditorIndex",
  middleware: "authenticated",
  data() {
    return {
      tagstr: "",
      errors: null,
      article: {
        title: "",
        description: "",
        body: "",
        tagList: [],
      },
    };
  },
  async mounted() {
    const slug = this.$route.params.slug;
    if (slug) {
      this.slug = slug;
      const { data } = await getArticle(slug);
      this.article = data.article;
    }
  },
  methods: {
    enterTag() {
      this.article.tagList.push(this.tagstr);
      this.tagstr = "";
    },
    removeTag(index) {
      this.article.tagList.splice(index, 1);
    },
    async submitArticle() {
      try {
        if (this.slug) {
          const { data } = await updateArticle(this.slug, { article: this.article });
          this.$router.push(`/article/${data.article.slug}`);
        } else {
          const { data } = await createArticle({
            article: this.article,
          });
          this.$router.push(`/article/${data.article.slug}`);
        }
      } catch (e) {
        this.errors = e.response.data.errors;
      }
    },
  },
};
```

### 设置页修改个人资料

`pages/settings/index.vue`

```vue
<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">{{ field }} {{ messages }}</li>
            </template>
          </ul>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="url"
                  placeholder="URL of profile picture"
                  v-model="user.image"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="user.username"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="user.bio"
                  required
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  v-model="user.email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  v-model="user.password"
                  required
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right" @click.prevent="handleSubmit">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout">Or click here to logout.</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Cookie = process.client ? require("js-cookie") : undefined;
import { updateUser } from "@/api/user";
import { mapState } from "vuex";

export default {
  name: "Settings",
  middleware: "authenticated",
  data() {
    return {
      user: {
        bio: "",
        email: "",
        image: "",
        password: "",
        username: "",
      },
      errors: {}, // 错误信息
    };
  },
  computed: {
    ...mapState({ storeUser: "user" }),
  },

  mounted() {
    this.user.bio = this.storeUser.bio;
    this.user.email = this.storeUser.email;
    this.user.image = this.storeUser.image;
    this.user.password = this.storeUser.password;
    this.user.username = this.storeUser.username;
  },

  methods: {
    async handleSubmit() {
      try {
        const { data } = await updateUser({
          user: this.user,
        });

        console.log("data", data);

        // 更新用户的登录状态
        this.$store.commit("setUser", data.user);

        // 为了防止刷新页面数据丢失，数据需要持久化
        Cookie.set("user", data.user);

        this.$router.push(`/profile/${data.user.username}`);
      } catch (e) {
        this.errors = e.response.data.errors;
      }
    },
    logout() {
      // 删除用户的登录状态
      this.$store.commit("setUser", null);

      // 删除数据持久化
      Cookie.set("user", null);

      this.$router.push("/");
    },
  },
};
</script>
```

### 用户个人主页

```vue
<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              :class="{ active: profile.following }"
              @click="onFollow(profile)"
            >
              <i class="ion-plus-round"></i>
              &nbsp; Follow {{ profile.username }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'my' }"
                  :to="{
                    name: 'profile',
                    params: {
                      profile: profile.username,
                    },
                    query: {
                      tab: 'my',
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'favorited' }"
                  :to="{
                    name: 'profile',
                    params: {
                      profile: profile.username,
                    },
                    query: {
                      tab: 'favorited',
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div class="article-preview" v-for="article in articles" :key="article.slug">
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                  class="author"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{ article.createdAt | date("MMM DD, YYYY") }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="tag in article.tagList"
                  :key="tag"
                >
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>
          <!-- 分页 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{ active: item === page }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username,
                    },
                    query: {
                      page: item,
                      tab,
                    },
                  }"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getProfiles } from "@/api/profile";
import { getArticles, deleteFavorite, addFavorite, deleteFollow, addFollow } from "@/api/article";
export default {
  name: "UserProfile",
  watchQuery: ["tab", "page"],
  async asyncData(context) {
    const { tab = "my", page = 1 } = context.query;
    const { username } = context.params;

    const limit = 5;
    const offset = (page - 1) * limit;

    const articleParams = tab === "my" ? { author: username } : { favorited: username };

    articleParams.limit = limit;
    articleParams.offset = offset;

    const [profileRes, articlesRes] = await Promise.all([
      getProfiles(username),
      getArticles(articleParams),
    ]);
    const { profile } = profileRes.data;
    const { articles, articlesCount } = articlesRes.data;
    articles.forEach((article) => (article.favoriteDisabled = false));

    return {
      tab,
      limit,
      page,
      profile,
      articles,
      articlesCount,
    };
  },
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async onFavorite(article) {
      if (!this.user) return this.$router.push("/login");
      article.favoriteDisabled = true; // 禁用点击
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount -= 1;
      } else {
        // 添加点赞
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false; // 允许点击
    },
    async onFollow(author) {
      if (!this.user) return this.$router.push("/login");
      author.followDisabled = true; // 禁用点击
      if (author.following) {
        // 取消点赞
        await deleteFollow(author.username);
        author.following = false;
        author.favoritesCount -= 1;
      } else {
        // 添加点赞
        await addFollow(author.username);
        author.following = true;
        author.followesCount += 1;
      }
      author.followDisabled = false; // 允许点击
    },
  },
};
</script>

<style scoped></style>
```

最终代码

> [云牧/realworld-nuxtjs (gitee.com)](https://gitee.com/z1725163126/realworld-nuxtjs)

## 6.Nuxt.js 发布部署

### 1. 使用命令打包

https://zh.nuxtjs.org/guide/commands

_Nuxt.js 提供了一系列常用的命令, 用于开发或发布部署。_

| 命令          | 描述                                                                               |
| ------------- | ---------------------------------------------------------------------------------- |
| nuxt          | 启动一个热加载的 Web 服务器（开发模式） [localhost:3000](http://localhost:3000/)。 |
| nuxt build    | 利用 webpack 编译应用，压缩 JS 和 CSS 资源（发布用）。                             |
| nuxt start    | 以生产模式启动一个 Web 服务器 (需要先执行`nuxt build`)。                           |
| nuxt generate | 编译应用，并依据路由配置生成对应的 HTML 文件 (用于静态站点的部署)。                |

可以将这些命令添加至 `package.json`：

```json
"scripts": {
  "dev": "nuxt",
  "build": "nuxt build",
  "start": "nuxt start"
}
```

先执行`npm run build`，再执行`npm run start`

### 2. 最简单的部署方式

#### 配置 Host + Port

```js
// nuxt.config.js
server: {
  host: '0.0.0.0',// 监听所有外网地址。在生产环境服务器上外网环境就能访问到了，在本地的话，局域网都能访问到了
    port: 3000
},
```

#### 压缩发布包

- `.nuxt`文件夹（Nuxt 打包生成的资源文件）
- static 文件夹（项目中的静态资源）
- nuxt.config.js（给 Nuxt 服务来使用的）
- package.json （因为在服务端要安装第三方包）
- yarn.lock（因为在服务端要安装第三方包）

#### 把发布包传到服务端

- 登录服务器：ssh root@y2y7.com
- 选择一个目录创建一个 realworld-nuxtjs 文件夹：`mkdir realworld-nuxtjs`
- `cd realworld-nuxtjs`进入这个文件夹，
- 使用 pwd 命令打印当前文件夹路径 `/product/front/realworld-nuxtjs`
- 回到本地，使用 scp 命令往服务器传压缩包：scp .\realworld-nuxtjs.zip root@jiailing.com:/product/front/realworld-nuxtjs

#### 解压

- 回到服务器的`realworld-nuxtjs`文件夹里，此时已经有了一个`realworld-nuxtjs.zip`文件
- 执行`unzip realworld-nuxtjs.zip`对压缩包解压
- 然后使用`ls -al`查看解压后的所有文件

#### 安装依赖

- 执行`npm i`

#### 启动服务

- 执行`npm run start`启动服务
- 访问：http://y2y7.com:3000/

### 3. 使用 PM2 在后台启动应用

- Github 仓库地址：https://github.com/Unitech/pm2
- 官方文档：https://pm2.io
- 在生产环境上安装：`npm install --global pm2`
- 启动：pm2 start 脚本路径，即：`pm2 start npm -- start `
- 访问：http://jiailing.com:3000/

PM2 常用命令

| 命令        | 说明         |
| ----------- | ------------ |
| pm2 list    | 查看应用列表 |
| pm2 start   | 启动应用     |
| pm2 stop    | 停止应用     |
| pm2 reload  | 重载应用     |
| pm2 restart | 重启应用     |
| pm2 delete  | 删除应用     |

### 4. 自动部署

传统的部署方式

- 更新
  - 本地构建
  - 发布
- 更新

  - 本地构建
  - 发布

- ....

现代化的部署方式（CI/CD）

![在这里插入图片描述](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/20200913150540222.png)

#### 使用 GitHub Actions 实现自动部署

CI/CD 服务:

- Jenkins
- Gitlab CI
- Github Actions
- Travis CI
- Circle CI
- …

环境准备

- Linux 服务器
- 把本地代码提交到 GitHub 远程仓库

配置 GitHub Access Token

- 生成：https://github.com/settings/tokens

- 头像 -> Settings -> Developer settings -> Personal access tokens -> Generate new Token

- Token 名称填写 Tocken，Select scopes 勾选 repo，然后滚动到网页最下面点击提交按钮。生成 Token

![image-20220114170613485](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220114170613485.png)

配置 GitHub Actions 执行脚本

- 在项目根目录创建.github/workflows 目录

- 下载 main.yml(https://github.com/lipengzhou/realworld-nuxtjs/edit/master/.github/workflows/main.yml)到workflows目录

- 修改配置 main.yml

- 修改对应的服务器路径为：/product/front/realworld-nuxtjs

- wget 后面的下载地址改为自己的仓库地址: `https://github.com/2604150210/realworld-nuxtjs/releases/latest/download/release.tgz`

- 在项目里配置 HOST、USERNAME、PASSWORD、PORT

![image-20220114170803562](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220114170803562.png)

最终的 main.yml

```yaml
name: Publish And Deploy Demo
on:
  push:
    tags:
      - "v*"

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      # 下载源码
      - name: Checkout
        uses: actions/checkout@master

      # 打包构建
      - name: Build
        uses: actions/setup-node@master
      - run: yarn
      - run: yarn build
      - run: tar -zcvf release.tgz .nuxt static nuxt.config.js package.json yarn.lock pm2.config.json

      # 发布 Release
      - name: Create Release
        id: create_release
        uses: actions/create-release@master
        env:
          GITHUB_TOKEN: ${{ secrets.TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false

      # 上传构建结果到 Release
      - name: Upload Release Asset
        id: upload-release-asset
        uses: actions/upload-release-asset@master
        env:
          GITHUB_TOKEN: ${{ secrets.TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./release.tgz
          asset_name: release.tgz
          asset_content_type: application/x-tgz

      # 部署到服务器
      - name: Deploy
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          password: ${{ secrets.PASSWORD }}
          port: ${{ secrets.PORT }}
          script: |
            cd /product/front/realworld-nuxtjs
            wget https://github.com/2604150210/realworld-nuxtjs/releases/latest/download/release.tgz -O release.tgz
            tar zxvf release.tgz
            npm install --production
            pm2 reload pm2.config.json
```

- 配置 PM2 配置文件 pm2.config.json

```json
{
  "apps": [
    {
      "name": "RealWorld",
      "script": "npm",
      "args": "start"
    }
  ]
}
```

提交更新

- git add .
- git commit -m "第一次发布部署-测试"
- git push （此时只是推送了提交记录，并不会触发自动化构建）
- git add .
- git tag v0.1.0 （通过 tag 打版）
- git tag （查看版本）
- git push origin v0.1.0 （把本地标签推送到远程仓库，会触发自动构建）

查看自动部署动态

![image-20220114182343324](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220114182343324.png)
