# Koa 基础

## 1.介绍

- Koa 是一个新的 web 框架，**由 Express 幕后的原班人马打造**，致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。

- - 官网：https://koajs.com/
  - GitHub 仓库：https://github.com/koajs/koa

- - 一个翻译的中文网：https://koa.bootcss.com/

- Koa 的原理和内部结构很像 Express，但是语法和内部结构进行了升级
- Koa **内部使用 ES6 编写**，号称是下一代 Node.js Web 框架

- 它的主要特点是通过**利用 async 函数，帮你丢弃回调函数**

- - Koa 1 是基于 ES2015 中的 Generator 生成器函数结合 CO 模块
  - Koa 2 完全抛弃了 Generator 和 co，升级为了 ES2017 中的 async/await 函数

- 正式由于 Koa 内部基于最新的异步处理方式，所以使用 **Koa 处理异常更加简单**
- Koa 中提供了 CTX 上下文对象

- - Express 是扩展了 req 和 res

- **Koa 并没有捆绑任何中间件**， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。
- 有很多开发工具/框架都是基于 Koa 的

- - [Egg.js](https://eggjs.org/)
  - 构建工具 [Vite](https://github.com/vitejs/vite)

- [Koa vs Express](https://github.com/koajs/koa/blob/master/docs/koa-vs-express.md)
- 个人评价

- - koa 2 好用，设计上的确有优势。优势不在能实现更强的功能，而是可以更简单地完成功能。
  - koa 2 社区远不如 express

- - koa 1 在思想上与 koa 2 是一致的，但是 koa 2 的实现更漂亮

- [Awesome Koa](https://github.com/ellerbrock/awesome-koa)

## 2.Koa 基本用法

### 1、安装 koa

```shell
npm i koa
```

> Koa 依赖 node v7.6.0 或 ES2015 及更高版本和 async 方法支持。

### 2、app.js

```js
// 使用 Koa 启动一个 HTTP 服务
const Koa = require("koa");

const app = new Koa();

// Koa 没有路由系统，只有中间件功能
// ctx: context 上下文对象(请求,响应)
app.use((ctx) => {
  ctx.body = "Hello Koa";
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

- Koa 应用程序是一个包含一组中间件函数的对象
- 它是按照类似堆栈的方式组织和执行的

- Koa 内部没有捆绑任何中间件，甚至是路由功能

### 3.Koa 中的 Context 对象

> 参见：https://koa.bootcss.com/#context。

## 3.Koa 中的路由

### 原生路由

网站一般都有多个页面。通过 ctx.request.path 可以获取用户请求的路径，由此实现简单的路由。

```js
app.use((ctx) => {
  const path = ctx.path;
  if (path === "/") {
    ctx.body = "home page";
  } else if (path === "/foo") {
    ctx.body = "foo page";
  } else {
    ctx.body = "404 Not Found";
  }
});
```

### koa-router 模块

原生路由用起来不太方便，我们可以使用封装好的 [koa-router](https://github.com/koajs/router) 模块。

- Express 路由风格（app.get、app.put、app.post ...）
- 命名动态 URL 参数

- 具有 URL 生成的命名路由
- 使用允许的请求方法响应 OPTIONS 请求

- 支持 405 和 501 响应处理
- 支持多路由中间件

- 支持多个嵌套的路由中间件
- 支持 async/await 语法

#### 1、安装

```shell
npm i @koa/router
```

#### 2、示例

```js
const Koa = require("koa");
const Router = require("@koa/router");

const app = new Koa();
const router = new Router();

router.get("/", (ctx) => {
  ctx.body = "home page";
});

router.post("/", (ctx) => {
  ctx.body = "post /";
});

router.get("/foo", (ctx) => {
  ctx.body = "foo page";
});

// 动态路径
router.get("/users/:id", (ctx) => {
  console.log(ctx.params);
  ctx.body = "users page";
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
```

### 静态资源托管

> 如果网站提供静态资源（图片、字体、样式表、脚本......），为它们一个个写路由就很麻烦，也没必要。[koa-static](https://github.com/koajs/static) 模块封装了这部分的请求。

#### 1、安装

```shell
npm install koa-static
```

#### 2、示例

```js
const static = require("koa-static");
const path = require("path");

app.use(static("./public"));
app.use(static(path.join(__dirname, "./public"))); // 设置绝对路径
app.use(mount("/foo", static(path.join(__dirname, "./public")))); // 设置虚拟路径
```

### 给静态资源设置虚拟路径

使用 Koa 提供的 [koa-mount](https://github.com/koajs/mount)

```js
const mount = require("koa-mount");
const static = require("koa-static");
const path = require("path");

app.use(mount("/foo", static(path.join(__dirname, "./public"))));
```

### 重定向

> 有些场合，服务器需要重定向（redirect）访问请求。比如，用户登陆以后，将他重定向到登陆前的页面。ctx.response.redirect()方法可以发出一个 302 跳转，将用户导向另一个路由。

```js
router.get("/foo", (ctx) => {
  ctx.body = "foo page";
});

router.get("/bar", (ctx) => {
  // 重定向针对的同步请求
  ctx.redirect("/foo");
});
```

### 中间件栈

> Koa 的最大特色，也是最重要的一个设计，就是中间件（middleware）。

![image-20220109154430929](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220109154430929.png)

- 多个中间件会形成一个栈结构（middle stack），以"先进后出"（first-in-last-out）的顺序执行。
- 最外层的中间件首先执行。

- 调用 next 函数，把执行权交给下一个中间件。
- ...

- 最内层的中间件最后执行。
- 执行结束后，把执行权交回上一层的中间件。

- ...
- 最外层的中间件收回执行权之后，执行 next 函数后面的代码。

中间件栈结构示例如下：

```js
const one = (ctx, next) => {
  console.log(">> one");
  next();
  console.log("<< one");
};

const two = (ctx, next) => {
  console.log(">> two");
  next();
  console.log("<< two");
};

const three = (ctx, next) => {
  console.log(">> three");
  next();
  console.log("<< three");
};

app.use(one);
app.use(two);
app.use(three);
```

如果中间件内部没有调用 `next` 函数，那么执行权就不会传递下去。作为练习，你可以将 `two` 函数里面 `next()` 这一行注释掉再执行，看看会有什么结果。

### 异步中间件

> 迄今为止，所有例子的中间件都是同步的，不包含异步操作。如果有异步操作（比如读取数据库），中间件就必须写成 async 函数。

```js
const fs = require("fs");
const util = require("util");

app.use(async (ctx, next) => {
  const data = await util.promisify(fs.readFile)("./views/index.html");
  ctx.type = "html";
  ctx.body = data;
  next();
});
```

### 中间件的合成

> [koa-compose](https://github.com/koajs/compose) 模块可以将多个中间件合成为一个。

#### 1、安装

```shell
npm install koa-compose
```

#### 2、示例

```js
const compose = require("koa-compose");
const a1 = (ctx, next) => {
  console.log("a1");
  next();
};

const a2 = (ctx, next) => {
  console.log("a2");
  next();
};

const a3 = (ctx, next) => {
  console.log("a3");
  next();
};

app.use(compose([a1, a2, a3]));
```

## Koa 中的错误处理

### 500 错误

如果代码运行过程中发生错误，我们需要把错误信息返回给用户。HTTP 协定约定这时要返回 500 状态码。Koa 提供了 ctx.throw()方法，用来抛出错误，ctx.throw(500)就是抛出 500 错误。

```js
const main = (ctx) => {
  ctx.throw(500);
};
```

### 404 错误

如果将 ctx.response.status 设置成 404，就相当于 ctx.throw(404)，返回 404 错误。

```
const main = ctx => {
  ctx.response.status = 404;
  ctx.response.body = 'Page Not Found';
};
```

### 处理错误的中间件

> 为了方便处理错误，最好使用 `try...catch` 将其捕获。但是，为每个中间件都写 `try...catch` 太麻烦，我们可以让最外层的中间件，负责所有中间件的错误处理。

```js
// 在最外层添加异常捕获的中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.message;
    ctx.app.emit("error", err, ctx);
    // ctx.body = '服务端内部错误'
  }
});

// 建议每个中间件函数写成async函数并且 await next()
app.use(async (ctx, next) => {
  JSON.parse("{}");
  // ctx.body = 'Hello Koa'
  // next() // 无法捕获后面的异步中间件
  // return next() // 可以捕获
  await next(); // 可以捕获
});

app.use(async (ctx) => {
  const data = await readFile("./dnskjandsa.html");
  ctx.type = "html";
  ctx.body = data;
});
```

### error 事件的监听

运行过程中一旦出错，Koa 会触发一个 error 事件。监听这个事件，也可以处理错误。

```js
const main = ctx => {
  ctx.throw(500);
};

app.on('error', (err, ctx) =>
  console.error("server error", err);
);
```

如果 req/res 期间出现错误，并且 _无法_ 响应客户端，Context 实例仍然被传递：

```js
app.on("error", (err, ctx) => {
  log.error("server error", err, ctx);
});
```

当发生错误并且仍然可以响应客户端时，也没有数据被写入 socket 中，Koa 将用一个 500 “内部服务器错误” 进行适当的响应。在任一情况下，为了记录目的，都会发出应用级 “错误”

### 释放 error 事件

> 需要注意的是，如果错误被 try...catch 捕获，就不会触发 error 事件。这时，必须调用 ctx.app.emit()，手动释放 error 事件，才能让监听函数生效。

```js
const handler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.type = "html";
    ctx.response.body = "<p>Something wrong, please contact administrator.</p>";
    ctx.app.emit("error", err, ctx);
  }
};

const main = (ctx) => {
  ctx.throw(500);
};

app.on("error", function (err) {
  console.log("logging error ", err.message);
  console.log(err);
});
```

上面代码中，`main` 函数抛出错误，被 `handler` 函数捕获。`catch` 代码块里面使用 `ctx.app.emit()` 手动释放 `error` 事件，才能让监听函数监听到。

## Koa 开发 Web App 功能

### Cookies

> `ctx.cookies` 用来读写 Cookie。

```js
const main = function (ctx) {
  const n = Number(ctx.cookies.get("view") || 0) + 1;
  ctx.cookies.set("view", n);
  ctx.response.body = n + " views";
};
```

访问 http://127.0.0.1:3000 ，你会看到 1 views。刷新一次页面，就变成了 2 views。再刷新，每次都会计数增加 1。

### 表单

> Web 应用离不开处理表单。本质上，表单就是 POST 方法发送到服务器的键值对。koa-body 模块可以用来从 POST 请求的数据体里面提取键值对

```js
const koaBody = require("koa-body");

const main = async function (ctx) {
  const body = ctx.request.body;
  if (!body.name) ctx.throw(400, ".name required");
  ctx.body = { name: body.name };
};

app.use(koaBody());
```

### 文件上传

> koa-body 模块还可以用来处理文件上传。

```js
const os = require("os");
const path = require("path");
const koaBody = require("koa-body");

const main = async function (ctx) {
  const tmpdir = os.tmpdir();
  const filePaths = [];
  const files = ctx.request.body.files || {};

  for (let key in files) {
    const file = files[key];
    const filePath = path.join(tmpdir, file.name);
    const reader = fs.createReadStream(file.path);
    const writer = fs.createWriteStream(filePath);
    reader.pipe(writer);
    filePaths.push(filePath);
  }

  ctx.body = filePaths;
};

app.use(koaBody({ multipart: true }));
```
