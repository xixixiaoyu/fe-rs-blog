# Express 介绍

## Express 是什么

Express 是一个快速，简单，极简的 Node.js web 应用开发框架。通过它，可以轻松的构建各种 web 应用。例如

- 接口服务
- 传统的 web 网站

- 开发工具集成等
- ...

Express 本身是极简的，仅仅提供了 web 开发的基础功能，但是它通过中间件的方式集成了许许多多的外部插件来处理 HTTP 请求。

- [body-parser](http://expressjs.com/resources/middleware/body-parser.html)：解析 HTTP 请求体
- [compression](http://expressjs.com/resources/middleware/compression.html)：压缩 HTTP 响应

- [cookie-parser](http://expressjs.com/resources/middleware/cookie-parser.html)：解析 cookie 数据
- [cors](http://expressjs.com/resources/middleware/cors.html)：处理跨域资源请求

- [morgan](http://expressjs.com/resources/middleware/morgan.html)：HTTP 请求日志记录
- ...

Express 中间件的特性固然强大，但是它所提供的灵活性是一把双刃剑。

- 它让 Express 本身变得更加灵活和简单
- 缺点在于虽然有一些中间件包可以解决几乎所有问题或需求，但是挑选合适的包有时也会成为一个挑战

Express 不对 Node.js 已有的特性进行二次抽象，只是在它之上扩展了 web 应用所需的基本功能。

- 内部使用的还是 http 模块
- 请求对象继承自 [http.IncomingMessage](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_incomingmessage)

- 响应对象继承自：[http.ServerResponse](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_serverresponse)
- ...

有很多[流行框架](http://expressjs.com/en/resources/frameworks.html)基于 Express。

- [LoopBack](http://loopback.io/)：高度可扩展的开源 Node.js 框架，用于快速创建动态的端到端 REST API。
- [Sails](http://sailsjs.org/)：用于 Node.js 的 MVC 框架，用于构建实用的，可用于生产的应用程序。

- [NestJs](https://github.com/nestjs/nest)：一个渐进式的 Node.js 框架，用于在 TypeScript 和 JavaScript（ES6，ES7，ES8）之上构建高效，可扩展的企业级服务器端应用程序。
- ...

Express 的开发作者是知名的开源项目创建者和协作者 TJ Holowaychuk。

- GitHub：https://github.com/tj
- Express、commander、ejs、co、Koa...

## Express 特性

- 简单易学
- 丰富的基础 API 支持，以及常见的 HTTP 辅助程序，例如重定向、缓存等

- 强大的路由功能
- 灵活的中间件

- 高性能
- 非常稳定（它的源代码几乎百分百的测试覆盖率）

- 视图系统支持 14 个以上的主流模板引擎
- ...

## Express 发展历史

- Express.js 由 TJ Holowaychuk 创立。首次发行的版本 0.12.0，依据 Express.js 的 GitHub 仓库，是在 2010 年 5 月 22 日
- 在 2014 年 6 月，StrongLoop 获得了项目的管理权。StrongLoop 在 2015 年 9 月被 IBM 并购。在 2016 年 1 月，IBM 宣布将 Express.j s 置于 Node.js 基金会孵化器的管理之下。

- 目前最新稳定版为 4.17.1，可以通过 [GitHub Releases](https://github.com/expressjs/express/releases) 查看版本发布记录

## Express 应用场景

- 传统的 Web 网站

- - [Ghost](https://github.com/TryGhost/Ghost)
  - ...

- 接口服务
- 服务端渲染中间层

- 开发工具

- - [JSON Server](https://github.com/typicode/json-server)
  - [webpack-dev-server](https://github.com/webpack/webpack-dev-server)

- ...

## Express 相关链接

- [Express 官网](http://expressjs.com/)
- [Express GitHub 仓库](https://github.com/expressjs/express)

- [Express 中文文档（非官方）](http://www.expressjs.com.cn/)
- [Awesome Express](https://github.com/rajikaimal/awesome-express)

# Express 起步

## Hello World

目标：使用 Express 创建一个 web 服务，输出 Hello World 响应内容。

```shell
mkdir myapp

cd myapp

npm init

npm install express

touch app.js
```

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000/`);
});
```

## 路由基础

> 路由是指确定应用程序如何响应客户端对特定端点的请求，该特定端点是 URI（或路径）和特定的 HTTP 请求方法（GET，POST 等）。
>
> 每个路由可以具有一个或多个处理程序函数，这些函数在匹配该路由时执行。
>
> 路由定义采用以下结构：

在根路径响应 `Hello World!`：

```js
app.get("/", (req, res) => {
  res.send("Hello World!");
});
```

在根路由响应 `POST` 请求：

```js
app.post("/", (req, res) => {
  res.send("post /");
});
```

响应对 `/user` 路径的 `PUT` 请求：

```js
app.put("/user", (req, res) => {
  res.send("put user");
});
```

响应对 `/user` 路由的 `DELETE` 请求：

```js
app.delete("/user", (req, res) => {
  res.send("delete user");
});
```

有关路由的更多详细信息，请参见[路由指南](http://expressjs.com/en/guide/routing.html)。

## 请求和响应

Express 应用使用路由回调函数的参数：`request` 和 `response` 对象来处理请求和响应的数据。

```js
app.get("/", (req, res) => {
  // ...
});
```

Express 不对 Node.js 已有的特性进行二次抽象，只是在它之上扩展了 web 应用所需的基本功能。

- 内部使用的还是 http 模块
- 请求对象继承自 [http.IncomingMessage](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_incomingmessage)

- 响应对象继承自：[http.ServerResponse](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_serverresponse)
- ...

### 请求对象

req 对象代表 HTTP 请求，并具有请求查询字符串，参数，正文，HTTP 标头等的属性。在本文档中，按照约定，该对象始终称为 req（HTTP 响应为 res），但其实际名称由您正在使用的回调函数的参数确定。

属性：

| 属性                                                                       | 说明 |
| -------------------------------------------------------------------------- | ---- |
| [req.app](http://expressjs.com/en/4x/api.html#req.app)                     |      |
| [req.baseUrl](http://expressjs.com/en/4x/api.html#req.baseUrl)             |      |
| [req.body](http://expressjs.com/en/4x/api.html#req.body)                   |      |
| [req.cookies](http://expressjs.com/en/4x/api.html#req.cookies)             |      |
| [req.fresh](http://expressjs.com/en/4x/api.html#req.fresh)                 |      |
| [req.hostname](http://expressjs.com/en/4x/api.html#req.hostname)           |      |
| [req.ip](http://expressjs.com/en/4x/api.html#req.ip)                       |      |
| [req.ips](http://expressjs.com/en/4x/api.html#req.ips)                     |      |
| [req.method](http://expressjs.com/en/4x/api.html#req.method)               |      |
| [req.originalUrl](http://expressjs.com/en/4x/api.html#req.originalUrl)     |      |
| [req.params](http://expressjs.com/en/4x/api.html#req.params)               |      |
| [req.path](http://expressjs.com/en/4x/api.html#req.path)                   |      |
| [req.protocol](http://expressjs.com/en/4x/api.html#req.protocol)           |      |
| [req.query](http://expressjs.com/en/4x/api.html#req.query)                 |      |
| [req.route](http://expressjs.com/en/4x/api.html#req.route)                 |      |
| [req.secure](http://expressjs.com/en/4x/api.html#req.secure)               |      |
| [req.signedCookies](http://expressjs.com/en/4x/api.html#req.signedCookies) |      |
| [req.stale](http://expressjs.com/en/4x/api.html#req.stale)                 |      |
| [req.subdomains](http://expressjs.com/en/4x/api.html#req.subdomains)       |      |
| [req.xhr](http://expressjs.com/en/4x/api.html#req.xhr)                     |      |

常见方法：

| 方法                                                                               | 说明 |
| ---------------------------------------------------------------------------------- | ---- |
| [req.accepts()](http://expressjs.com/en/4x/api.html#req.accepts)                   |      |
| [req.acceptsCharsets()](http://expressjs.com/en/4x/api.html#req.acceptsCharsets)   |      |
| [req.acceptsEncodings()](http://expressjs.com/en/4x/api.html#req.acceptsEncodings) |      |
| [req.acceptsLanguages()](http://expressjs.com/en/4x/api.html#req.acceptsLanguages) |      |
| [req.get()](http://expressjs.com/en/4x/api.html#req.get)                           |      |
| [req.is()](http://expressjs.com/en/4x/api.html#req.is)                             |      |
| [req.param()](http://expressjs.com/en/4x/api.html#req.param)                       |      |
| [req.range()](http://expressjs.com/en/4x/api.html#req.range)                       |      |

### 响应对象

res 对象表示 Express 应用在收到 HTTP 请求时发送的 HTTP 响应。

在本文档中，按照约定，该对象始终称为 res（并且 HTTP 请求为 req），但其实际名称由您正在使用的回调函数的参数确定。

属性：

- [res.app](http://expressjs.com/en/4x/api.html#res.app)
- [res.headersSent](http://expressjs.com/en/4x/api.html#res.headersSent)

- [res.locals](http://expressjs.com/en/4x/api.html#res.locals)

方法：

- [res.append()](http://expressjs.com/en/4x/api.html#res.append)
- [res.attachment()](http://expressjs.com/en/4x/api.html#res.attachment)

- [res.cookie()](http://expressjs.com/en/4x/api.html#res.cookie)
- [res.clearCookie()](http://expressjs.com/en/4x/api.html#res.clearCookie)

- [res.download()](http://expressjs.com/en/4x/api.html#res.download)
- [res.end()](http://expressjs.com/en/4x/api.html#res.end)

- [res.format()](http://expressjs.com/en/4x/api.html#res.format)
- [res.get()](http://expressjs.com/en/4x/api.html#res.get)

- [res.json()](http://expressjs.com/en/4x/api.html#res.json)
- [res.jsonp()](http://expressjs.com/en/4x/api.html#res.jsonp)

- [res.links()](http://expressjs.com/en/4x/api.html#res.links)
- [res.location()](http://expressjs.com/en/4x/api.html#res.location)

- [res.redirect()](http://expressjs.com/en/4x/api.html#res.redirect)
- [res.render()](http://expressjs.com/en/4x/api.html#res.render)

- [res.send()](http://expressjs.com/en/4x/api.html#res.send)
- [res.sendFile()](http://expressjs.com/en/4x/api.html#res.sendFile)

- [res.sendStatus()](http://expressjs.com/en/4x/api.html#res.sendStatus)
- [res.set()](http://expressjs.com/en/4x/api.html#res.set)

- [res.status()](http://expressjs.com/en/4x/api.html#res.status)
- [res.type()](http://expressjs.com/en/4x/api.html#res.type)

- [res.vary()](http://expressjs.com/en/4x/api.html#res.vary)

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log(req.url); // 请求地址
  console.log(req.method); // 请求方法
  console.log(req.headers); // 请求头
  console.log("请求参数", req.query);

  // 设置响应状态码
  // res.statusCode = 201

  // 结束响应
  // res.end()

  // res.send('Hello World!')

  // res.write('a')
  // res.write('b')
  // res.write('c')
  // res.end()

  // res.end('Hello World!')

  // res.send('Hello World!')
  // res.send({
  //   foo: 'bar'
  // })

  res.cookie("foo", "bar");
  res.cookie("a", 123);
  res.status(201).send("OK");
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000/`);
});
```

## 案例

-

通过该案例创建一个简单的 CRUD 接口服务，从而掌握 Express 的基本用法。

需求：实现对任务清单的 CRUD 接口服务。

- 查询任务列表

- - GET /todos

- 根据 ID 查询单个任务

- - GET /todos/:id

- 添加任务

- - POST /todos

- 修改任务

- - PATCH /todos

- 删除任务

- - DELETE /todos/:id

### 准备数据文件 db.json

```json
{
  "todos": [
    {
      "title": "吃饭",
      "id": 1
    },
    {
      "title": "睡觉",
      "id": 3
    }
  ],
  "users": []
}
```

### 封装数据操作模块 db.js

```js
const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const dbPath = path.join(__dirname, "./db.json");

exports.getDb = async () => {
  const data = await readFile(dbPath, "utf8");
  return JSON.parse(data);
};

exports.saveDb = async (db) => {
  const data = JSON.stringify(db, null, "  ");
  await writeFile(dbPath, data);
};
```

### Read 查询列表

查询列表：

```js
app.get("/todos", async (req, res) => {
  try {
    const db = await getDb();
    res.status(200).json(db.todos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
```

### Read 根据 id 查询单个

```js
app.get("/todos/:id", async (req, res) => {
  try {
    const db = await getDb();

    const todo = db.todos.find((todo) => todo.id === Number.parseInt(req.params.id));

    if (!todo) {
      return res.status(404).end();
    }

    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
```

### Create 添加

```js
// 配置解析表单请求体：application/json
app.use(express.json());

// 解析表单请求体：application/x-www-form-urlencoded
app.use(express.urlencoded());

app.post("/todos", async (req, res) => {
  try {
    // 1. 获取客户端请求体参数
    const todo = req.body;

    // 2. 数据验证
    if (!todo.title) {
      return res.status(422).json({
        error: "The field title is required.",
      });
    }

    // 3. 数据验证通过，把数据存储到 db 中
    const db = await getDb();

    const lastTodo = db.todos[db.todos.length - 1];
    todo.id = lastTodo ? lastTodo.id + 1 : 1;
    db.todos.push(todo);
    await saveDb(db);
    // 4. 发送响应
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
```

### Update 更新

```js
app.patch("/todos/:id", async (req, res) => {
  try {
    // 1. 获取表单数据
    const todo = req.body;

    // 2. 查找到要修改的任务项
    const db = await getDb();
    const ret = db.todos.find((todo) => todo.id === Number.parseInt(req.params.id));

    if (!ret) {
      return res.status(404).end();
    }

    Object.assign(ret, todo);

    await saveDb(db);

    res.status(200).json(ret);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
```

### Destroy 删除

```js
app.delete("/todos/:id", async (req, res) => {
  try {
    const todoId = Number.parseInt(req.params.id);
    const db = await getDb();
    const index = db.todos.findIndex((todo) => todo.id === todoId);
    if (index === -1) {
      return res.status(404).end();
    }
    db.todos.splice(index, 1);
    await saveDb(db);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
```

## Express 中间件

- 示例引入
- 概念解析

- 详细使用
- 原理分析

## 通过示例了解中间件

```js
app.get("/", (req, res) => {
  res.send("get /");
});

app.get("/about", (req, res) => {
  res.send("get /about");
});

app.post("/login", (req, res) => {
  res.send("post /login");
});
```

最简单的实现：

```js
app.get("/", (req, res) => {
  console.log(`${req.method} ${req.url} ${Date.now()}`);
  res.send("index");
});

app.get("/about", (req, res) => {
  console.log(`${req.method} ${req.url} ${Date.now()}`);
  res.send("about");
});

app.post("/login", (req, res) => {
  console.log(`${req.method} ${req.url} ${Date.now()}`);
  res.send("login");
});
```

针对于这样的代码我们自然想到了封装来解决：

```js
app.get("/", (req, res) => {
  // console.log(`${req.method} ${req.url} ${Date.now()}`)
  logger(req);
  res.send("index");
});

app.get("/about", (req, res) => {
  // console.log(`${req.method} ${req.url} ${Date.now()}`)
  logger(req);
  res.send("about");
});

app.get("/login", (req, res) => {
  // console.log(`${req.method} ${req.url} ${Date.now()}`)
  logger(req);
  res.send("login");
});

function logger(req) {
  console.log(`${req.method} ${req.url} ${Date.now()}`);
}
```

这样的做法自然没有问题，但是大家想一想，我现在只有三个路由，如果说有 10 个、100 个、1000 个呢？那我在每个请求路由函数中都手动调用一次也太麻烦了。

好了，我们不卖关子了，来看一下我们如何使用中间件来解决这个简单的小功能。

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${Date.now()}`);
  next();
});

app.get("/", (req, res) => {
  res.send("index");
});

app.get("/about", (req, res) => {
  res.send("about");
});

app.get("/login", (req, res) => {
  res.send("login");
});
```

上面代码执行之后我们发现任何请求进来都会先在服务端打印请求日志，然后才会执行具体的业务处理函数。那这个到底是怎么回事？

## 中间件概念

> Express 的最大特色，也是最重要的一个设计，就是中间件。一个 Express 应用，就是由许许多多的中间件来完成的。
>
> 为了理解中间件，我们先来看一下我们现实生活中的自来水厂的净水流程。

![water-middleware.jpeg](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/1593791623604-eb0bc9ca-b96a-4d13-968c-39515aa7cc8c.jpeg)

在上图中，自来水厂从获取水源到净化处理交给用户，中间经历了一系列的处理环节，我们称其中的每一个处理环节就是一个中间件。这样做的目的既提高了生产效率也保证了可维护性。

在我理解 Express 中间件和 AOP **面向切面编程**就是一个意思，就是都需要经过经过的一些步骤，**不去修改自己的代码，以此来扩展或者处理一些功能**。

什么是 AOP？中文意思是面向切面编程，听起来感觉很模糊。先举个生产的例子。

农场的水果包装流水线一开始只有 `采摘 - 清洗 - 贴标签`。

![img](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/1606791993814-06028d5b-ab36-4d99-be89-0ed26670d990.png)

为了提高销量，想加上两道工序 `分类` 和 `包装` 但又不能干扰原有的流程，同时如果没增加收益可以随时撤销新增工序。

![img](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/1606792010197-0901cd00-3dc2-4d4a-8afd-f03c43d31910.png)

最后在流水线中的空隙插上两个工人去处理，形成 `采摘 - 分类 - 清洗 - 包装 - 贴标签` 的新流程，而且工人可以随时撤回。

AOP（Aspect Oriented Programming）面向切面编程：

- 将日志记录，性能统计，安全控制，事务处理，异常处理等代码从业务逻辑代码中划分出来，通过对这些行为的分离，我们希望可以**将它们独立到非指导业务逻辑的方法中，进而改变这些行为的时候不影响业务逻辑的代码**。
- 利用 AOP 可以对业务逻辑的各个部分进行隔离，从而使得**业务逻辑各部分之间的耦合度降低**，提高**程序的可重用性**，同时**提高了开发的效率和可维护性**。

![image.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/1606804927810-91912383-b0a0-4529-ac44-84af46843643.png)

总结：就是在现有代码程序中，在程序生命周期或者横向流程中 `加入/减去` 一个或多个功能，不影响原有功能。

## Express 中的中间件

> 在 Express 中，中间件就是一个可以访问请求对象、响应对象和调用 next 方法的一个函数。

![image.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/1606806595999-9bbe42dd-1edc-4841-921b-4b1be0a34a40.png)

在中间件函数中可以执行以下任何任务：

- 执行任何代码
- 修改 request 或者 response 响应对象

- 结束请求响应周期
- 调用下一个中间件

注意：如果当前的中间件功能没有结束请求-响应周期，则必须调用 next() 将控制权传递给下一个中间件功能。否则，该请求将被挂起。

## Express 中间件分类

在 Express 中应用程序可以使用以下类型的中间件：

- 应用程序级别中间件
- 路由级别中间件

- 错误处理中间件
- 内置中间件

- 第三方中间件

### 应用程序级别中间件

不关心请求路径：

```js
const express = require("express");
const app = express();

app.use(function (req, res, next) {
  console.log("Time:", Date.now());
  next();
});
```

限定请求路径：

```js
app.use("/user/:id", function (req, res, next) {
  console.log("Request Type:", req.method);
  next();
});
```

限定请求方法 + 请求路径：

```js
app.get("/user/:id", function (req, res, next) {
  res.send("USER");
});
```

多个处理函数：

```js
app.use(
  "/user/:id",
  function (req, res, next) {
    console.log("Request URL:", req.originalUrl);
    next();
  },
  function (req, res, next) {
    console.log("Request Type:", req.method);
    next();
  }
);
```

为同一个路径定义多个处理中间件：

```js
app.get(
  "/user/:id",
  function (req, res, next) {
    console.log("ID:", req.params.id);
    next();
  },
  function (req, res, next) {
    res.send("User Info");
  }
);

// handler for the /user/:id path, which prints the user ID
app.get("/user/:id", function (req, res, next) {
  res.end(req.params.id);
});
```

要从路由器中间件堆栈中跳过其余中间件功能，请调用 `next('route')` 将控制权传递给下一条路由。

注意：`next('route')` 仅在使用 `app.METHOD()` 或 `router.METHOD()` 函数加载的中间件函数中有效。

此示例显示了一个中间件子堆栈，该子堆栈处理对/user/:id 路径的 GET 请求。

```js
app.get(
  "/user/:id",
  function (req, res, next) {
    // if the user ID is 0, skip to the next route
    if (req.params.id === "0") next("route");
    // otherwise pass the control to the next middleware function in this stack
    else next();
  },
  function (req, res, next) {
    // send a regular response
    res.send("regular");
  }
);

// handler for the /user/:id path, which sends a special response
app.get("/user/:id", function (req, res, next) {
  res.send("special");
});
```

中间件也可以在数组中声明为可重用。

此示例显示了一个带有中间件子堆栈的数组，该子堆栈处理对 `/user/:id` 路径的 `GET` 请求

```js
function logOriginalUrl(req, res, next) {
  console.log("Request URL:", req.originalUrl);
  next();
}

function logMethod(req, res, next) {
  console.log("Request Type:", req.method);
  next();
}

var logStuff = [logOriginalUrl, logMethod];
app.get("/user/:id", logStuff, function (req, res, next) {
  res.send("User Info");
});
```

### 路由器级中间件

路由器级中间件与应用程序级中间件的工作方式相同，只不过它绑定到的实例 `express.Router()`。

```js
const router = express.Router();
```

使用 `router.use()` 和 `router.METHOD()` 函数加载路由器级中间件。

```js
// 路由模块
const express = require("express");
const { getDb, saveDb } = require("./db");

// 1. 创建路由实例
// 路由实例其实就相当于一个 mini Express 实例
const router = express.Router();

// 2. 配置路由
router.get("/", async (req, res, next) => {
  try {
    const db = await getDb();
    res.status(200).json(db.todos);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const db = await getDb();

    const todo = db.todos.find((todo) => todo.id === Number.parseInt(req.params.id));

    if (!todo) {
      return res.status(404).end();
    }

    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.post("/", async (req, res, next) => {
  try {
    // 1. 获取客户端请求体参数
    const todo = req.body;

    // 2. 数据验证
    if (!todo.title) {
      return res.status(422).json({
        error: "The field title is required.",
      });
    }

    // 3. 数据验证通过，把数据存储到 db 中
    const db = await getDb();

    const lastTodo = db.todos[db.todos.length - 1];
    todo.id = lastTodo ? lastTodo.id + 1 : 1;
    db.todos.push(todo);
    await saveDb(db);
    // 4. 发送响应
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    // 1. 获取表单数据
    const todo = req.body;

    // 2. 查找到要修改的任务项
    const db = await getDb();
    const ret = db.todos.find((todo) => todo.id === Number.parseInt(req.params.id));

    if (!ret) {
      return res.status(404).end();
    }

    Object.assign(ret, todo);

    await saveDb(db);

    res.status(200).json(ret);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const todoId = Number.parseInt(req.params.id);
    const db = await getDb();
    const index = db.todos.findIndex((todo) => todo.id === todoId);
    if (index === -1) {
      return res.status(404).end();
    }
    db.todos.splice(index, 1);
    await saveDb(db);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// 3. 导出路由实例
module.exports = router;

// 4. 将路由挂载集成到 Express 实例应用中
// 给路由限定访问前缀
app.use("/todos", router);
```

要跳过路由器的其余中间件功能，请调用 next('router') 将控制权转回路由器实例。

此示例显示了一个中间件子堆栈，该子堆栈处理对/user/:id 路径的 GET 请求。

```js
const express = require("express");
const app = express();
const router = express.Router();

// predicate the router with a check and bail out when needed
router.use(function (req, res, next) {
  if (!req.headers["x-auth"]) return next("router");
  next();
});

router.get("/user/:id", function (req, res) {
  res.send("hello, user!");
});

// use the router and 401 anything falling through
app.use("/admin", router, function (req, res) {
  res.sendStatus(401);
});
```

### 错误处理中间件

以与其他中间件函数相同的方式定义错误处理中间件函数，除了使用四个参数而不是三个参数（特别是使用签名(err, req, res, next)）之外：

```js
// 在所有的中间件之后挂载错误处理中间件
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

错误处理中间件始终带有四个参数。您必须提供四个参数以将其标识为错误处理中间件函数。即使不需要使用该 next 对象，也必须指定它以维护签名。否则，该 `next` 对象将被解释为常规中间件，并且将无法处理错误。

如果将任何内容传递给该 next()函数（字符串除外'route'），Express 都会将当前请求视为错误，并且将跳过所有剩余的非错误处理路由和中间件函数。

```js
// 路由模块
const express = require("express");
const { getDb, saveDb } = require("./db");

// 1. 创建路由实例
// 路由实例其实就相当于一个 mini Express 实例
const router = express.Router();

// 2. 配置路由
router.get("/", async (req, res, next) => {
  try {
    const db = await getDb();
    res.status(200).json(db.todos);
  } catch (err) {
    // 如果将任何内容传递给next() 函数（字符串'route'除外），Express都会将当前请求视为错误，并且将跳过所有剩余的无错误处理路由和中间件函数。

    // next() 往后匹配下一个中间件

    // next('route') 往后匹配当前中间件堆栈中的下一个

    next(err); // 跳过所有剩余的无错误处理路由和中间件函数。

    // res.status(500).json({
    //   error: err.message
    // })
  }
});

// 3. 导出路由实例
module.exports = router;
```

### 处理 404

在所有路由中间件最后添加下面中间件，没有被路由匹配到的请求都将进入这里。

```js
app.use((req, res, next) => {
  res.status(404).send("404 Not Found.");
});
```

### 内置中间件

Express 具有以下内置中间件函数：

- [express.json()](http://expressjs.com/en/4x/api.html#express.json) 解析 Content-Type 为 `application/json` 格式的请求体
- [express.urlencoded()](http://expressjs.com/en/4x/api.html#express.urlencoded) 解析 Content-Type 为 `application/x-www-form-urlencoded` 格式的请求体

- [express.raw()](http://expressjs.com/en/4x/api.html#express.raw) 解析 Content-Type 为 `application/octet-stream` 格式的请求体
- [express.text()](http://expressjs.com/en/4x/api.html#express.text) 解析 Content-Type 为 `text/plain` 格式的请求体

- [express.static()](http://expressjs.com/en/4x/api.html#express.static) 托管静态资源文件

### 第三方中间件

早期的 Express 内置了很多中间件。后来 Express 在 4.x 之后移除了这些内置中间件，官方把这些功能性中间件以包的形式单独提供出来。这样做的目的是为了保持 Express 本身极简灵活的特性，开发人员可以根据自己的需要去灵活的使用。

有关 Express 常用的第三方中间件功能的部分列表，请参阅：http://expressjs.com/en/resources/middleware.html。

# Express 路由

路由是指应用程序的端点（URI）如何响应客户端请求。有关路由的介绍，请参见[基本路由](http://expressjs.com/en/starter/basic-routing.html)。

您可以使用 `app` 与 HTTP 方法相对应的 Express 对象的方法来定义路由。例如，`app.get() `处理 GET 请求和 `app.post` POST 请求。有关完整列表，请参见 [app.METHOD](http://expressjs.com/en/4x/api.html#app.METHOD)。您还可以使用 [app.all](http://expressjs.com/en/4x/api.html#app.all)[()](http://expressjs.com/en/4x/api.html#app.all) 处理所有 HTTP 方法，并使用 [app.use()](http://expressjs.com/en/4x/api.html#app.use) 将中间件指定为回调函数（有关详细信息，请参见[使用中间件](http://expressjs.com/en/guide/using-middleware.html)）。

这些路由方法指定在应用程序收到对指定路由（端点）和 HTTP 方法的请求时调用的回调函数（有时称为“处理函数”）。换句话说，应用程序“侦听”与指定的路由和方法匹配的请求，并且当它检测到匹配项时，它将调用指定的回调函数。

实际上，路由方法可以具有多个回调函数作为参数。对于多个回调函数，重要的是提供 `next` 回调函数的参数，然后 `next()` 在函数体内调用以将控制权移交给下一个回调。

以下代码是一个非常基本的路由示例。

```javascript
var express = require("express");
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get("/", function (req, res) {
  res.send("hello world");
});
```

## 路由方法

路由方法是从 HTTP 方法之一派生的，并附加到 `express` 该类的实例。

以下代码是为 GET 和 POST 方法定义的到应用根目录的路由的示例。

```javascript
// GET method route
app.get("/", function (req, res) {
  res.send("GET request to the homepage");
});

// POST method route
app.post("/", function (req, res) {
  res.send("POST request to the homepage");
});
```

Express 支持与所有 HTTP 请求方法相对应的方法：`get`，`post` 等。有关完整列表，请参见 [app.METHOD](http://expressjs.com/en/4x/api.html#app.METHOD)。

有一种特殊的路由方法，`app.all()` 用于为*所有*HTTP 请求方法的路径加载中间件功能。例如，无论是使用 GET，POST，PUT，DELETE 还是 [http 模块](https://nodejs.org/api/http.html#http_http_methods) 支持的任何其他 HTTP 请求方法，都会对路由 `/secret` 的请求执行以下处理程序。

```javascript
app.all("/secret", function (req, res, next) {
  console.log("Accessing the secret section ...");
  next(); // pass control to the next handler
});
```

## 路由路径

路由路径与请求方法结合，定义了可以进行请求的端点。路由路径可以是字符串，字符串模式或正则表达式。

字符`?`，`+`，`*`，和`()`是他们的正则表达式的对应的子集。连字符（`-`）和点（`.`）由基于字符串的路径按字面意义进行解释。

如果您需要`$`在路径字符串中使用美元字符（），请将其转义`([`并括在和中`])`。例如，“ `/data/$book`”处用于请求的路径字符串将为“ `/data/([\$])book`”。

Express 使用[path-to-regexp](https://www.npmjs.com/package/path-to-regexp)来匹配路由路径；有关定义路由路径的所有可能性，请参见正则表达式路径文档。[Express Route Tester](http://forbeslindesay.github.io/express-route-tester/)尽管不支持模式匹配，但却是用于测试基本 Express 路由的便捷工具。

查询字符串不是路由路径的一部分。

以下是一些基于字符串的路由路径示例。

此路由路径会将请求匹配到根路由`/`。

```javascript
app.get("/", function (req, res) {
  res.send("root");
});
```

此路由路径会将请求匹配到`/about`。

```javascript
app.get("/about", function (req, res) {
  res.send("about");
});
```

此路由路径会将请求匹配到`/random.text`。

```javascript
app.get("/random.text", function (req, res) {
  res.send("random.text");
});
```

以下是一些基于字符串模式的路由路径示例。

此路由路径将与`acd`和匹配`abcd`。

```javascript
app.get("/ab?cd", function (req, res) {
  res.send("ab?cd");
});
```

这条路线的路径将会匹配`abcd`，`abbcd`，`abbbcd`，等等。

```javascript
app.get("/ab+cd", function (req, res) {
  res.send("ab+cd");
});
```

这条路线的路径将会匹配`abcd`，`abxcd`，`abRANDOMcd`，`ab123cd`，等。

```javascript
app.get("/ab*cd", function (req, res) {
  res.send("ab*cd");
});
```

此路由路径将与`/abe`和匹配`/abcde`。

```javascript
app.get("/ab(cd)?e", function (req, res) {
  res.send("ab(cd)?e");
});
```

基于正则表达式的路由路径示例：

此路由路径将匹配其中带有“ a”的任何内容。

```javascript
app.get(/a/, function (req, res) {
  res.send("/a/");
});
```

这条路线的路径将匹配`butterfly`和`dragonfly`，但不`butterflyman`，`dragonflyman`等。

```javascript
app.get(/.*fly$/, function (req, res) {
  res.send("/.*fly$/");
});
```

## 路径参数

路由参数被命名为 URL 段，用于捕获 URL 中在其位置处指定的值。捕获的值将填充到 `req.params` 对象中，并将路径中指定的 route 参数的名称作为其各自的键。

```javascript
Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" }
```

要使用路由参数定义路由，只需在路由路径中指定路由参数，如下所示。

```javascript
app.get("/users/:userId/books/:bookId", function (req, res) {
  res.send(req.params);
});
```

路径参数的名称必须由“文字字符”（[A-Za-z0-9_]）组成。

由于连字符（`-`）和点（`.`）是按字面解释的，因此可以将它们与路由参数一起使用，以实现有用的目的。

```javascript
Route path: /flights/:from-:to
Request URL: http://localhost:3000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" }
Route path: /plantae/:genus.:species
Request URL: http://localhost:3000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" }
```

要更好地控制可以由 route 参数匹配的确切字符串，可以在括号（`()`）后面附加一个正则表达式：

```plain
Route path: /user/:userId(\\d+)
Request URL: http://localhost:3000/user/42
req.params: {"userId": "42"}
```

由于正则表达式通常是文字字符串的一部分，因此请确保`\`使用其他反斜杠对所有字符进行转义，例如`\\d+`。

在 Express 4.x 中，[不以常规方式解释正则表达式中](https://github.com/expressjs/express/issues/2495)[的](https://github.com/expressjs/express/issues/2495)`*`[字符](https://github.com/expressjs/express/issues/2495)。解决方法是，使用`{0,}`代替`*`。这可能会在 Express 5 中修复。

## 路由处理程序

您可以提供行为类似于[中间件的](http://expressjs.com/en/guide/using-middleware.html)多个回调函数来处理请求。唯一的例外是这些回调可能会调用`next('route')`以绕过其余的路由回调。您可以使用此机制在路由上施加先决条件，然后在没有理由继续使用当前路由的情况下将控制权传递给后续路由。

路由处理程序可以采用函数，函数数组或二者组合的形式，如以下示例所示。

单个回调函数可以处理路由。例如：

```javascript
app.get("/example/a", function (req, res) {
  res.send("Hello from A!");
});
```

多个回调函数可以处理一条路由（请确保指定了`next`对象）。例如：

```javascript
app.get(
  "/example/b",
  function (req, res, next) {
    console.log("the response will be sent by the next function ...");
    next();
  },
  function (req, res) {
    res.send("Hello from B!");
  }
);
```

回调函数数组可以处理路由。例如：

```javascript
var cb0 = function (req, res, next) {
  console.log("CB0");
  next();
};
var cb1 = function (req, res, next) {
  console.log("CB1");
  next();
};
var cb2 = function (req, res) {
  res.send("Hello from C!");
};
app.get("/example/c", [cb0, cb1, cb2]);
```

独立功能和功能数组的组合可以处理路由。例如：

```javascript
var cb0 = function (req, res, next) {
  console.log("CB0");
  next();
};
var cb1 = function (req, res, next) {
  console.log("CB1");
  next();
};
app.get(
  "/example/d",
  [cb0, cb1],
  function (req, res, next) {
    console.log("the response will be sent by the next function ...");
    next();
  },
  function (req, res) {
    res.send("Hello from D!");
  }
);
```

## 响应方法

`res` 下表中响应对象（）上的方法可以将响应发送到客户端，并终止请求-响应周期。如果没有从路由处理程序调用这些方法，则客户端请求将被挂起。

| 方法                                                                     | 描述                                                   |
| ------------------------------------------------------------------------ | ------------------------------------------------------ |
| [res.download()](http://expressjs.com/en/4x/api.html#res.download)       | 提示要下载的文件。                                     |
| [res.end()](http://expressjs.com/en/4x/api.html#res.end)                 | 结束响应过程。                                         |
| [res.json（）](http://expressjs.com/en/4x/api.html#res.json)             | 发送 JSON 响应。                                       |
| [res.jsonp（）](http://expressjs.com/en/4x/api.html#res.jsonp)           | 发送带有 JSONP 支持的 JSON 响应。                      |
| [res.redirect（）](http://expressjs.com/en/4x/api.html#res.redirect)     | 重定向请求。                                           |
| [res.render（）](http://expressjs.com/en/4x/api.html#res.render)         | 渲染视图模板。                                         |
| [res.send（）](http://expressjs.com/en/4x/api.html#res.send)             | 发送各种类型的响应。                                   |
| [res.sendFile（）](http://expressjs.com/en/4x/api.html#res.sendFile)     | 将文件作为八位字节流发送。                             |
| [res.sendStatus（）](http://expressjs.com/en/4x/api.html#res.sendStatus) | 设置响应状态代码，并将其字符串表示形式发送为响应正文。 |

## app.route()

您可以使用来为路由路径创建可链接的路由处理程序`app.route()`。由于路径是在单个位置指定的，因此创建模块化路由非常有帮助，减少冗余和错别字也很有帮助。有关路由的更多信息，请参见：[Router() 文档](http://expressjs.com/en/4x/api.html#router)。

这是使用定义的链式路由处理程序的示例 `app.route()`。

```javascript
app
  .route("/book")
  .get(function (req, res) {
    res.send("Get a random book");
  })
  .post(function (req, res) {
    res.send("Add a book");
  })
  .put(function (req, res) {
    res.send("Update the book");
  });
```

## 快速路由器

使用 `express.Router` 该类创建模块化的，可安装的路由处理程序。一个 `Router` 实例是一个完整的中间件和路由系统；因此，它通常被称为“迷你应用程序”。

以下示例将路由器创建为模块，在其中加载中间件功能，定义一些路由，并将路由器模块安装在主应用程序的路径上。

`birds.js` 在 app 目录中创建一个名为以下内容的路由器文件：

```javascript
var express = require("express");
var router = express.Router();
// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});
// define the home page route
router.get("/", function (req, res) {
  res.send("Birds home page");
});
// define the about route
router.get("/about", function (req, res) {
  res.send("About birds");
});
module.exports = router;
```

然后，在应用程序中加载路由器模块：

```javascript
var birds = require("./birds");
// ...
app.use("/birds", birds);
```

该应用程序现在将能够处理对 `/birds` 和的请求 `/birds/about`，以及调用 `timeLog` 特定于该路由的中间件功能。
