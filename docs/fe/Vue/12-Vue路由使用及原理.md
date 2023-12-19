# VueRouter 的使用及原理

> 早期的网站开发，当我们页面中需要请求不同的路径内容时，服务器直接生产渲染好对应的 HTML 页面，返回给客户端进行展示
>
> 一个页面有自己对应的网址, 也就是 URL
>
> URL 会发送到服务器, 服务器会通过正则对该 URL 进 d 行匹配, 并且最后交给一个 Controller 进行处理
>
> Controller 进行各种处理, 最终生成 HTML 或者数据, 返回给前端，这样也有利于 SEO 的优化
>
> 但是缺点就是前后端数据和逻辑混合，维护开发难度高，不利于前端发展
>
> 上述操作称之为**后端路由**
>
> 随着 Ajax 的出现, 有了前后端分离的开发模式
>
> 此时后端只是负责提供 API 了
>
> 前端每次请求都会从静态资源服务器请求文件，这些资源包括 HTML+CSS+JS，然后在前端对这些请求回来的资源使用 Javascript 进行渲染展示
>
> 这样做最大的优点就是前后端责任的清晰，后端专注于数据上，前端专注于交互和可视化上
>
> 并且当移动端(iOS/Android)出现后，后端不需要进行任何处理，依然使用之前的一套 API 即可

Vue Router 是 Vue.js 的官方路由。它与 Vue.js 核心深度集成

vue-router 是基于路由和组件的

- 路由用于设定访问路径, 将路径和组件映射起来
- 在 vue-router 控制的单页面应用中, 页面的路径的改变就是组件的切换.

安装 Vue Router： `npm install vue-router@4`

使用 vue-router 的步骤

1. 创建路由组件的组件

2. 配置路由映射: 组件和路径映射关系的 routes 数组

3. 通过 createRouter 创建路由对象，并且传入 routes 和 history 模式

4. 使用路由: 通过和`<router-link>`和`<router-view>`

```vue
<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
</template>
```

`router/index.js`

```js
import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
```

`main.js`

```js
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");
```

几个注意点

1. 路由组件通常存放在`pages`文件夹，一般组件通常存放在`components`文件夹。
2. 通过切换，“隐藏”了的路由组件，默认是被销毁掉的，需要的时候再去挂载。
3. 每个组件都有自己的`$route`属性，里面存储着自己的路由信息。
4. 整个应用只有一个 router，可以通过组件的`$router`属性获取到。

## 1.默认路径

默认进入网站我们希望重定向到某个路径渲染对应组件

```js
const routes = [
  // path配置的是根路径: / redirect是重定向到/home路径
  { path: "/", redirect: "/home" },
  { path: "/home", component: Home },
];
```

## 2.router-link

router-link 事实上有很多属性可以配置

to 属性:

- 是一个字符串，或者是一个对象

replace 属性

- 设置 replace 属性的话，当点击时，会调用 router.replace()，而不是 router.push()

active-class 属性

- 设置激活 a 元素后应用的 class，默认是 router-link-active

exact-active-class 属性

- 链接精准激活时，应用于渲染的 的 class，默认是 router-link-exact-active

### replace 属性

- 作用：控制路由跳转时操作浏览器历史记录的模式

- 浏览器的历史记录有两种写入方式：分别为`push`和`replace`，路由跳转时候默认为`push`

- `push`是追加历史记录，在用户点击返回时，上一个页面还可以回退

- `replace`是替换当前记录

![image-20220115005556642](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220115005556642.png)

## 3.路由懒加载

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载

如果我们能分割不同的组件为不同的代码块，当路由被访问时再进行加载，显然能提高渲染效率

```js
const routes = [
  { path: "/", redirect: "/home" },
  // component可以传入一个组件，也可以接收一个函数，该函数 需要放回一个Promise；
  // 而import函数就是返回一个Promise
  { path: "/home", component: () => import("../pages/Home.vue") },
];
```

## 4.路由其他属性

- name 属性：路由记录独一无二的名称
- meta 属性：自定义的数据

```js
const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    component: () => import("../pages/Home.vue"),
    name: "home",
    meta: {
      name: "yunmu",
      age: 18,
    },
  },
];
```

通过给路由命名 name 后可以简化路由跳转

```vue
<!--简化后，直接通过名字跳转 -->
<router-link :to="{name: "home"}">跳转</router-link>

<!--简化写法配合传递参数 -->
<router-link
	:to="{
		name: "home",
		query:{
		   id:666,
           title:“云牧”
		}
	}"
>跳转</router-link>
```

## 5.动态路由（传递 params 参数）

很多时候我们需要将给定匹配模式的路由映射到同一个组件

比如我们跳转不同 ID 的用户界面，但其实都是跳转到同一个 User 组件

这时我们可以使用动态路由

1. 配置路由，声明接收 params 参数

`router/index.js`

```js
{
  path: "/home",
  component: Home,
  children: [
    {
      path: "news",
      component: News,
    },
    {
      component: Message,
      children: [
        {
          name: "xiangqing",
          path: "detail/:id/:title", //使用占位符声明接收params参数
          component: Detail,
        },
      ],
    },
  ],
};
```

2. 传递参数

```vue
<!-- 跳转并携带params参数，to的字符串写法 -->
<router-link :to="/home/message/detail/666/你好">跳转</router-link>

<!-- 跳转并携带params参数，to的对象写法 -->
<router-link
  :to="{
    name: 'xiangqing',
    params: {
      id: 666,
      title: '你好',
    },
  }"
>跳转</router-link>
```

> 特别注意：路由携带 params 参数时，若使用 to 的对象写法，则不能使用 path 配置项，必须使用 name 配置！

`view/User.vue`

```vue
<template>
  <div>
    这是User页面
    <!-- 方式一：通过当前路由规则，获取数据 -->
    通过当前路由规则获取：{{ $route.params.id }}
    <!-- 方式二：路由规则中开启props传参（推荐）-->
    通过开启props获取： {{ id }}
  </div>
</template>

<script>
import { useRoute } from "vue-router";
export default {
  name: "User",
  // 将路由参数配置到props中
  props: ["id"],
  setup() {
    // 方式三：在setup中 通过useRoute钩子返回的Route对象获取
    const route = useRoute();
    console.log(route.params.id);
  },
};
</script>
```

匹配多个参数

```js
{
    // 例如当路径为/user/123/info/yunmu时匹配上
    path: "/user/:id/info/:name",
    component: () => import("../pages/User.vue"),
},
```

## 6.NotFound

对于哪些没有匹配到的路由，我们通常会匹配到比如 NotFound 的错误页面中

我们可以通过 `$route.params.pathMatch`获取到传入的参数

```js
{
    path: "/:pathMatch(.*)",
    component: () => import("../pages/NotFound.vue"),
 },
```

匹配规则加\*通过`$route.params.pathMatch`会解析路径为数组

```js
{
    path: "/:pathMatch(.*)*",
    component: () => import("../pages/NotFound.vue"),
 },
```

## 7.嵌套路由

之前我们开发的 Home，User 路由都属于底层路由

这时可能 Home 页面本身，也会存在多个组件之间来回切换

- 比如 Home 中包括 Message、Shops 组件，它们可以在 Home 内部来回切换

这时候就需要用到嵌套路由，注意在 Home 中也要使用 `<router-view>` 来占位之后需要渲染的组件

`router/index.js`

```js
{
    path: "/home",
    name: "home",
    component: () => import(/* webpackChunkName: "home-chunk" */ "../pages/Home.vue"),
    children: [ //通过children配置子级路由
      {
        path: "message",   //此处一定不要写：/message
        component: () => import("../pages/HomeMessage.vue"),
      },
      {
        path: "shops",    //此处一定不要写：/shops
        component: () => import("../pages/HomeShops.vue"),
      },
    ],
},
```

`pages/Home.vue`

```vue
<template>
  <div>
    <h2>Home</h2>
    <router-view />

    <router-link to="/home/message">消息</router-link>
    <router-link to="/home/shops">商品</router-link>
  </div>
</template>
```

## 8.编程式路由导航

有时候我们希望通过代码完成页面跳转，不通过`<router-link>`实现路由跳转

```js
jumpToAbout() {
    this.$router.push("/about")
    // 也可以传入一个对象
    this.$router.push({
        path: "/about"
    })
}
```

setup 中我们可以通过 useRouter 来获取 router 对象进行跳转操作

```js
setup() {
    const router = useRouter();

    const jumpToAbout = () => {
        router.push("/about");
        // router.push({
        //   path: "/about",
        // })
        // router.replace("/about")
    };

    return {
        jumpToAbout,
    };
```

```js
// 向前移动一条记录 与 router.forward() 相同
router.go(1);

// 向后回退一条记录 与 router.back() 相同
router.go(-1);

// 前进四条记录
router.go(4);

// 无那么多记录，静默失败
router.go(100);

router.forward(); //前进

router.back(); //后退
```

## 9.路由的 query 传递参数

1. 传递参数

```js
<!-- 跳转并携带query参数，to的字符串写法 -->
<router-link :to="/home/message/detail?id=666&title=你好">跳转</router-link>

<!-- 跳转并携带query参数，to的对象写法 -->
<router-link
	:to="{
		path:'/home/message/detail',
		query:{
		   id:666,
            title:'你好'
		}
	}"
>跳转</router-link>

<!-- 跳转并携带query参数，to的对象写法 -->
const jumpToAbout = () => {
    router.push({
        path: "/about",
        query: {
            name: "yunmu",
            age: 18
        }
    })
};
```

接收参数

```html
$route.query.name $route.query.age
```

## 10.缓存路由组件

- 作用：让不展示的路由组件保持挂载，不被销毁。

```vue
<keep-alive include="News"> 
    <router-view></router-view>
</keep-alive>
```

## 11.两个新的生命周期钩子

1. 作用：路由组件所独有的两个钩子，用于捕获路由组件的激活状态。
2. 具体名字：
   1. `activated`路由组件被激活时触发。
   2. `deactivated`路由组件失活时触发。

## 12.router-link 的 v-slot

> 在 vue-router3.x 的时候，router-link 有一个 tag 属性，可以决定 router-link 到底渲染成什么元素
>
> 但是在 vue-router4.x 开始，该属性被移除了
>
> 取而代之给我们提供了更加具有灵活性的 v-slot 的方式来定制渲染的内容

首先，我们需要使用 custom 表示我们整个元素要自定义，如果不写，那么自定义的内容会被包裹在一个 a 元素中

其次，我们使用 v-slot 来作用域插槽来获取内部传给我们的值

- href：解析后的 URL
- route：解析后的规范化的 route 对象
- navigate：触发导航的函数
- isActive：是否匹配的状态
- isExactActive：是否是精准匹配的状态

```vue
<router-link to="/home" v-slot="props" custom>
    <button @click="props.navigate">{{ props.href }}</button>
    <button @click="props.navigate">哈哈哈</button>
    <p>{{ props.route }}</p>
    <span :class="{ active: props.isActive }">{{ props.isActive }}</span>
    <span :class="{ active: props.isActive }">{{ props.isExactActive }}</span>
</router-link>
```

router-view 也提供给我们一个插槽，可以用于`<transition>`和 `<keep-alive>` 组件来包裹你的路由组件

Component：要渲染的组件

```vue
<router-view v-slot="props">
    <transition name="yun">
        <keep-alive>
            <component :is="props.Component"></component>
        </keep-alive>
    </transition>
</router-view>
```

```css
.yun-active {
  color: red;
}

.yun-enter-from,
.yun-leave-to {
  opacity: 0;
}

.yun-enter-active,
.yun-leave-active {
  transition: opacity 1s ease;
}
```

## 13.路由的 props 配置

作用：让路由组件更方便的收到参数

```js
{
  name: "xiangqing",
  path: "detail/:id",
  component: Detail,

  //第一种写法：props值为对象，该对象中所有的key-value的组合最终都会通过props传给Detail组件
  // props:{a:900}

  //第二种写法：props值为布尔值，布尔值为true，则把路由收到的所有params参数通过props传给Detail组件
  // props:true

  //第三种写法：props值为函数，该函数返回的对象中每一组key-value都会通过props传给Detail组件
  props(route) {
    return {
      id: route.query.id,
      title: route.query.title,
    };
  },
};
```

## 14.动态添加删除路由

某些情况比如根据用户不同的权限，注册不同的路由

这个时候我们可以使用一个方法 addRoute 来动态添加路由

### 动态添加路由

```js
const categoryRoute = {
  path: "/category",
  name: "category",
  component: () => import("../pages/Category.vue"),
};
// 添加顶级路由对象
router.addRoute(categoryRoute);
```

```js
// 添加二级路由对象 第一个参数为路由名称 第二个为要添加的组件
router.addRoute("home", {
  path: "moment",
  component: () => import("../pages/HomeMoment.vue"),
});
```

### 动态删除路由

删除路由有三种方式：

1. 添加一个 name 相同的路由
2. 通过 router.removeRoute 方法，传入路由的名称
3. 通过 router.addRoute 方法的返回值函数进行执行

路由的其他方法补充

- router.hasRoute()：检查路由是否存在
- router.getRoutes()：获取一个包含所有路由记录的数组

## 15.路由导航守卫

> vue-router 提供的导航守卫主要用来对路由进行权限控制
>
> 分类：全局守卫、独享守卫、组件内守卫

### 全局的前置守卫

`router.beforeEach`是在导航触发时会被回调的，有两个参数

- to：即将进入的路由 Route 对象
- from：即将离开的路由 Route 对象

返回值

- false：取消当前导航
- 不返回或者 undefined：进行默认导航
- 返回一个路由地址
  - 可以是一个 string 类型的路径
  - 可以是一个对象，对象中包含 path、query、params 等信息

可选的第三个参数：next

- 在 Vue2 中我们是通过 next 函数来决定如何进行跳转的，但是很容易多次调用 next
- 但是在 Vue3 中我们是通过返回值来控制的，不再推荐使用 next 函数

```js
//全局前置守卫：初始化时执行、每次路由切换前执行
router.beforeEach((to, from, next) => {
  console.log("beforeEach", to, from);
  if (to.meta.isAuth) {
    //判断当前路由是否需要进行权限控制
    if (localStorage.getItem("name") === "yunmu") {
      //权限控制的具体规则
      next(); //放行
    } else {
      alert("暂无权限查看");
      // next({name:"home"})
    }
  } else {
    next(); //放行
  }
});

//全局后置守卫：初始化时执行、每次路由切换后执行
router.afterEach((to, from) => {
  console.log("afterEach", to, from);
  if (to.meta.title) {
    document.title = to.meta.title; //修改网页的title
  } else {
    document.title = "vue_test";
  }
});
```

### 登录守卫功能

- 比如我们完成一个功能，只有登录后才能看到其他页面

`login.vue`

```vue
<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const loginClick = () => {
      window.localStorage.setItem("token", "why");

      router.push({
        path: "/home",
      });
    };

    return {
      loginClick,
    };
  },
};
</script>
```

`router/index.js`

```js
router.beforeEach((to, from) => {
  if (to.path !== "/login") {
    const token = window.localStorage.getItem("token");
    if (!token) {
      return "/login";
    }
  }
});
```

### 其他导航守卫

> Vue 还提供了很多的其他守卫函数，目的都是在某一个时刻给予我们回调，让我们可以更好的控制程序的流程或者功能
>
> [导航守卫 | Vue Router (vuejs.org)](https://next.router.vuejs.org/zh/guide/advanced/navigation-guards.html)

完整的导航解析流程：

1. 导航被触发
2. 在失活的组件里调用 `beforeRouteLeave` 守卫
3. 调用全局的 `beforeEach` 守卫
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)
5. 在路由配置里调用 `beforeEnter`
6. 解析异步路由组件
7. 在被激活的组件里调用 `beforeRouteEnter`
8. 调用全局的 `beforeResolve` 守卫(2.5+)
9. 导航被确认
10. 调用全局的 `afterEach` 钩子
11. 触发 DOM 更新
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入

## 16.Hash 模式和 History 模式

### 1. 表现形式的区别

- Hash 模式：http://localhost/#/detail?id=1234
- History 模式：http://localhost/detail/1234

相比之下 History 更美观

### 2.原理的区别

- Hash 模式是基于锚点(#)，本质改变`window.location.href`改变 url 但是不刷新页面，hash 值不会包含在 HTTP 请求中，即：hash 值不会带给服务器。，但是若以后将地址通过第三方手机 app 分享，若 app 校验严格，则地址会被标记为不合法。
- History 模式是基于 HTML5 中的 History API，有六种模式改变 URL 不刷新页面，兼容性和 hash 模式相比略差。
  - replaceState：替换原来的路径
  - pushState：使用新的路径
  - popState：路径的回退
  - go：向前或向后改变路径
  - forward：向前改变路径
  - pback：向后改变路径

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>hash模式</title>
  </head>
  <body>
    <div id="app">
      <a href="#/home">home</a>
      <a href="#/about">about</a>

      <div class="content">Default</div>
    </div>

    <script>
      const contentEl = document.querySelector(".content");
      window.addEventListener("hashchange", () => {
        switch (location.hash) {
          case "#/home":
            contentEl.innerHTML = "Home";
            break;
          case "#/about":
            contentEl.innerHTML = "About";
            break;
          default:
            contentEl.innerHTML = "Default";
        }
      });
    </script>
  </body>
</html>
```

- URL 中#后面的内容作为路径地址
- 监听 hashchange 事件
- 根据当前路由地址找到对应组件重新渲染

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>history模式</title>
  </head>
  <body>
    <div id="app">
      <a href="/home">home</a>
      <a href="/about">about</a>

      <div class="content">Default</div>
    </div>

    <script>
      const contentEl = document.querySelector(".content");

      const changeContent = () => {
        switch (location.pathname) {
          case "/home":
            contentEl.innerHTML = "Home";
            break;
          case "/about":
            contentEl.innerHTML = "About";
            break;
          default:
            contentEl.innerHTML = "Default";
        }
      };

      const aEls = document.getElementsByTagName("a");
      for (let aEl of aEls) {
        aEl.addEventListener("click", (e) => {
          e.preventDefault();

          const href = aEl.getAttribute("href");
          // history.pushState({}, "", href);
          history.replaceState({}, "", href);

          changeContent();
        });
      }

      window.addEventListener("popstate", changeContent);
    </script>
  </body>
</html>
```

- 通过 History.pushState()方法改变地址栏(不会向服务器发送请求，但会将这次 URL 记录到历史中)
- 监听 popstate 事件
- 根据当前路由地址找到对应组件重新渲染

### 3.History 模式的使用

- History 需要服务器的支持
- 单页应用中，服务端不存在http://www.test.com/login这样的地址会返回找不到该页面
- 在服务端应该除了静态资源外都返回单页应用的 index.html

#### Node.js 服务器配置

```js
const path = require("path");
// 导入处理 history 模式的模块
const history = require("connect-history-api-fallback");
// 导入 express
const express = require("express");

const app = express();
// 关键：注册处理 history 模式的中间件
app.use(history());
// 处理静态资源的中间件，网站根目录 ../web
app.use(express.static(path.join(__dirname, "../web")));

// 开启服务器，端口是 3000
app.listen(3000, () => {
  console.log("服务器开启，端口：3000");
});
```

#### Nginx 服务器配置

```shell
# 启动
start nginx
# 重启
nginx -s reload
# 停止
nginx -s stop
```

**nginx.conf**

```nginx
http: {
	server: {
		location / {
			root html;
			index index.html index.htm;
			# 尝试查找，找不到就回到首页
			try_files $uri $uri/ /index.html;
		}
	}
}
```

## 17.实现自己的 vue-router

### 模拟 VueRouter 的 history 模式的实现

实现思路

- 创建 LVueRouter 插件，静态方法 install
  - 创建 LVueRouter 插件，静态方法 install
  - 当 Vue 加载的时候把传入的 router 对象挂载到 Vue 实例上（注意：只执行一次） 创建 LVueRouter 类
- 初始化，options、routeMap、app(简化操作，创建 Vue 实例作为响应式数据记录当前路径)
- nitRouteMap() 遍历所有路由信息，把组件和路由的映射记录到 routeMap 对象中
- 注册 popstate 事件，当路由地址发生变化，重新记录当前的路径
- 创建 router-link 和 router-view 组件
- 当路径改变的时候通过当前路径在 routerMap 对象中找到对应的组件，渲染 router-view

`Vuerouter/index.js`

```js
let _Vue = null;

export default class VueRouter {
  static install(Vue) {
    // 1. 判断当前插件是否已经被安装
    if (VueRouter.install.installed) return;
    VueRouter.install.installed = true;
    // 2. 把Vue构造函数记录到全局变量
    _Vue = Vue;
    // 3. 把创建Vue实例时候传入的router对象注入到Vue实例上
    // 混入
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
          this.$options.router.init();
        }
      },
    });
  }

  constructor(options) {
    this.options = options;
    this.routeMap = {};
    // _Vue.observable创建响应式对象
    this.data = _Vue.observable({
      current: "/",
    });
  }

  init() {
    this.createRoutMap();
    this.initComponents(_Vue);
    this.initEvent();
  }

  createRoutMap() {
    // 遍历所有的路由规则，把路由规则解析成键值对的形式，存储到routeMap中
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component;
    });
  }

  initComponents(Vue) {
    Vue.component("router-link", {
      props: {
        to: String,
      },
      render(h) {
        return h(
          "a",
          {
            attrs: {
              href: this.to,
            },
            // 事件
            on: {
              click: this.clickHandler,
            },
          },
          [this.$slots.default]
        );
      },
      methods: {
        clickHandler(e) {
          history.pushState({}, "", this.to);
          this.$router.data.current = this.to;
          e.preventDefault();
        },
      },
      // template: '<a href="to"><slot></slot></a>'
    });
    const self = this;
    Vue.component("router-view", {
      render(h) {
        const component = self.routeMap[self.data.current];
        return h(component);
      },
    });
  }

  initEvent() {
    window.addEventListener("popstate", () => {
      this.data.current = window.location.pathname;
    });
  }
}
```

### 模拟 VueRouter 的 hash 模式的实现

```js
import Vue from "vue";
console.dir(Vue);
let _Vue = null;
export default class VueRouter {
  // 实现 vue 的插件机制
  static install(Vue) {
    //1 判断当前插件是否被安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    //2 把Vue的构造函数记录在全局
    _Vue = Vue;
    //3 把创建Vue的实例传入的router对象注入到Vue实例
    // _Vue.prototype.$router = this.$options.router
    // 混入
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
        }
      },
    });
  }

  // 初始化属性
  constructor(options) {
    this.options = options; // options 记录构造函数传入的对象
    this.routeMap = {}; // routeMap 路由地址和组件的对应关系
    // observable     data 是一个响应式对象
    this.data = _Vue.observable({
      current: "/", // 当前路由地址
    });
    this.init();
  }

  // 调用 createRouteMap, initComponent, initEvent 三个方法
  init() {
    this.createRouteMap();
    this.initComponent(_Vue);
    this.initEvent();
  }

  // 用来初始化 routeMap 属性，路由规则转换为键值对
  createRouteMap() {
    //遍历所有的路由规则 把路由规则解析成键值对的形式存储到routeMap中
    this.options.routes.forEach((route) => {
      this.routeMap[route.path] = route.component;
    });
  }

  // 用来创建 router-link 和 router-view 组件
  initComponent(Vue) {
    // router-link 组件
    Vue.component("router-link", {
      props: {
        to: String,
      },
      // render --- 可在 vue 运行时版直接使用
      render(h) {
        // h(选择器（标签的名字）， 属性，生成的某个标签的内容)
        return h(
          "a",
          {
            attrs: {
              href: "#" + this.to,
            },
            // 注册事件
            //   on: {
            //     click: this.clickHandler // 点击事件
            //   },
          },
          [this.$slots.default]
        ); // this.$slot.default 默认插槽
      },
    });
    // router-view 组件
    const self = this; //这里的 this 指向 vueRouter 实例
    Vue.component("router-view", {
      render(h) {
        // 根据 routerMap 中的对应关系，拿到当前路由地址所对应的组件
        const component = self.routeMap[self.data.current];
        return h(component);
      },
    });
  }

  // 用来注册 hashchange 事件
  initEvent() {
    window.addEventListener("hashchange", () => {
      this.data.current = this.getHash();
    });
    window.addEventListener("load", () => {
      if (!window.location.hash) {
        window.location.hash = "#/";
      }
    });
  }

  getHash() {
    return window.location.hash.slice(1) || "/";
  }
}
```

`Router/index.js`

```js
import VueRouter from "../vuerouter";
```
