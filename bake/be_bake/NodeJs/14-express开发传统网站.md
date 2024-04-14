## 1.概念介绍

关于服务端渲染可看我这篇：[服务端渲染基础 - 掘金 (juejin.cn)](https://juejin.cn/post/7052226471531642917)





## 2.动态网页渲染

> 这里所说的动态指的是页面数据内容，而不是动画之类的



### 发送一段普通文本

```js
res.send('Hello World!')
```



### 发送 HTML 格式的文本

```js
res.send('<h1>Hello World!</h1>')
```



### 发送 HTML 格式内容文件

为了便于开发和维护，我们把 HTML 格式的文本放到单独的文件中，比如 index.html：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>
```

然后通过文件操作读取文件内容发送到客户端：

```js
fs.readFile('index.html', 'utf8', (err, data) => {
	if (err) {
  	return res.status(404).send('404 Not Found.')
  }
  res.send(data)
})
```



### 处理页面中的动态内容

比如我有一份这样的数据：

```js
const todos = [
  { id: 1, title: '吃饭' },
  { id: 2, title: '睡觉' },
  { id: 3, title: '打豆豆' },
  { id: 4, title: '写代码' }
]
```

我需要把它展示到 HTML 页面中：

```html
<ul>
	<!-- 任务列表 -->
</ul>
```

最简单的做法就是在页面中放一个特殊的标记：

```html
<ul>
	<!-- 任务列表 -->
  	^_^
</ul>
```

然后在后端通过数据生成 HTML 字符串片段：

```js
let str = ''
todos.forEach(todo => {
	str += `<li>${todo.title}</li>`
})
```

最终将生成的结果替换到页面中特殊的标记位置，然后发送给客户端浏览器：

```js
res.send(data.replace('^_^', str))
```



```js
/**
 * Express 渲染动态网页
 */

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const todos = [
  { id: 1, title: "吃饭1" },
  { id: 2, title: "吃饭2" },
  { id: 3, title: "吃饭3" },
  { id: 4, title: "吃饭4" },
];

app.get("/", (req, res) => {
  // 1、普通文本
  // res.send('Hello World!')
  // 2、HTML 格式文本
  // res.send('<h1>Hello World!</h1>')
  // 3、为了便于开发和维护，把文本内容放到单独文件
  //   fs.readFile("./views/index.html", (err, data) => {
  //     if (err) {
  //       return res.status(404).send("404 Not Found.");
  //     }
  //     res.end(data);
  //   });
  // 4、动态页面渲染
  fs.readFile("./views/index.html", "utf8", (err, data) => {
    if (err) {
      return res.status(404).send("404 Not Found.");
    }
    // 获取数据
    // 获取页面模板
    // 数据 + 模板 = 完整页面
    let str = "";
    todos.forEach((todo) => {
      str += `<li>${todo.title}</li>`;
    });
    // ！！！渲染这件事儿是在服务端完成的
    const ret = data.replace("^_^", str);
    // 把渲染结果发送给客户端
    res.end(ret);
  });
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000/`);
});

```



### 使用模板引擎

> 所谓的模板引擎就是一个制定了特殊语法规则帮你简单高效的完成字符串解析替换的功能
>
> 在 Node.js 中有很多[不错的模板引擎](https://github.com/sindresorhus/awesome-nodejs#templating)：
>
> - [marko](https://github.com/marko-js/marko) - 基于HTML的模板引擎，可将模板编译为CommonJS模块，并支持流，异步渲染和自定义标签
> - [nunjucks](https://github.com/mozilla/nunjucks) - 具有继承，异步控制等功能的模板引擎（受Jinja2启发）
>
> - [handlebars.js](https://github.com/wycats/handlebars.js) - 胡子模板的超集，其中添加了强大的功能，如 helpers 和更高级的 blocks
> - [EJS](https://github.com/mde/ejs) - 一个 Express 作者开发的简单的模板引擎
>
> - [Pug](https://github.com/pugjs/pug) - 受Haml影响的高性能模板引擎
> - [art-template](https://github.com/aui/art-template) - 一个简约、超快的模板引擎。它采用作用域预声明的技术来优化模板渲染速度，从而获得接近 JavaScript 极限的运行性能，并且同时支持 NodeJS 和浏览器
>
> 这些模板引擎各有特色，不分上下。这里我以 art-template 为例演示其用法

```js
/**
 * Express 渲染动态网页
 */

const express = require("express");
const fs = require("fs");
const template = require("art-template");

const app = express();

const todos = [
  { id: 1, title: "吃饭1" },
  { id: 2, title: "吃饭2" },
  { id: 3, title: "吃饭3" },
  { id: 4, title: "吃饭4" },
];

app.get("/", (req, res) => {
  // 使用模板引擎
  // 1. 读取模板内容
  fs.readFile("./views/index.html", "utf8", (err, templateStr) => {
    if (err) {
      return res.status(404).send("404 Not Found.");
    }

    // 2. 获取数据
    // 3. 渲染这件事儿是在服务端完成的
    // 所谓的模板引擎就是在根据特定的规则进行字符串解析替换
    const ret = template.render(templateStr, {
      // 模板中使用的数据
      foo: "bar",
      todos,
    });

    // 把渲染结果发送给客户端
    res.end(ret);
  });
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000/`);
});
```





```js
/**
 * Express 渲染动态网页
 */

const express = require("express");
const path = require("path");

const app = express();

// view engine setup
app.engine("art", require("express-art-template")); // 当渲染以 .art 结尾的资源文件的时候使用 express-art-template
app.set("view options", {
  // art-template 模板引擎配置
  debug: process.env.NODE_ENV !== "production",
});
app.set("views", path.join(__dirname, "views")); // 模板文件的存储目录
app.set("view engine", "art"); // 可以省略的模板文件后缀名

const todos = [
  { id: 1, title: "吃饭1" },
  { id: 2, title: "吃饭2" },
  { id: 3, title: "吃饭3" },
  { id: 4, title: "吃饭4" },
];

app.get("/", (req, res) => {
  // 只要配置模板引擎，就可以使用 res.render 方法渲染页面了
  // 1、读模板文件 2、渲染 3、发送响应
  res.render("index", {
    foo: "bar",
    todos,
  });
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000/`);
});
```





## 3.静态资源托管



### 基本用法

要提供静态文件（例如图像，CSS 文件和 JavaScript 文件），请使用 Express 中的 `express.static` 内置中间件功能

```js
express.static(root, [options])
```

root 参数指定用于从其提供静态资产的根目录。有关 options 参数的更多信息，请参见 express.static



例如，使用以下代码在名为 public 的目录中提供图像，CSS 文件和 JavaScript 文件：

```js
app.use(express.static('public'))
```



现在，您可以加载 `public` 目录中的文件：

```
http://localhost:3000/images/kitten.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/app.js
http://localhost:3000/images/bg.png
http://localhost:3000/hello.html
```

Express 查找相对于静态目录的文件，因此静态目录的名称不是 URL 的一部分



### 托管多个静态资源

要使用多个静态资源目录，请多次调用 `express.static` 中间件函数：

```js
app.use(express.static('public'))
app.use(express.static('files'))
```

Express使用express.static中间件功能按设置静态目录的顺序查找文件

> 注意：为了获得最佳结果，请使用反向代理缓存来提高服务器静态资源的性能



### 虚拟路径

要为 `express.static` 函数提供服务的文件创建虚拟路径前缀（文件系统中实际上不存在该路径），请为静态目录指定安装路径，如下所示：

```js
app.use('/static', express.static('public'))
```



现在，您可以从/ static路径前缀加载公共目录中的文件：

```
http://localhost:3000/static/images/kitten.jpg
http://localhost:3000/static/css/style.css
http://localhost:3000/static/js/app.js
http://localhost:3000/static/images/bg.png
http://localhost:3000/static/hello.html
```



### 托管资源路径问题

但是，您提供给 `express.static` 函数的路径是相对于您启动节点进程的目录的。如果您从另一个目录运行 Express App，则使用要提供服务的目录的绝对路径更为安全：

```js
app.use('/static', express.static(path.join(__dirname, 'public')))
```



### 页面中的资源请求路径问题

> 在 file 协议中，相对于当前文件
>
>  在 http 协议中，相对于当前网页的 url 地址

```html
<!-- 绝对地址路径 -->
<link rel="stylesheet" href="http://example.com/xxx.css">

<!-- 绝对路径，当前网页主机地址 -->
<link rel="stylesheet" href="/xxx.css">

<!-- 相对路径，相对于当前网页 url -->
<link rel="stylesheet" href="xxx.css">
<link rel="stylesheet" href="./xxx.css">
<link rel="stylesheet" href="../xxx.css">
```





## 4.开发传统Web应用

案例地址：[Node/realworld-express · 云牧/exampleCode - 码云 - 开源中国 (gitee.com)](https://gitee.com/z1725163126/example-code/tree/master/Node/realworld-express)