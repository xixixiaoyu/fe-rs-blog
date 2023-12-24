# Express

## 1.Express简介

> Express 是一个基于 Node.js 平台的极简、灵活的 web 应用开发框架，它提供一系列强大的特性，帮助你快速创建各种 Web 和移动设备应用。
>
> 简单来说Express就是运行在node中的用来搭建服务器的模块。



## 2.Express使用

```js
//1. 安装 express
npm i express 
//2. 引入 express 包
const express = require("express");
//3. 创建应用对象
const app = express();
//4. 路由的设置
app.get("/", (request, response) => {
  //设置响应
  response.end("Hello Express");
});
//5. 监听端口 启动服务
app.listen(80, () => {
  console.log("服务已经启动.. 端口 80 监听中....");
});
```



## 3.Express路由



### 1.Route是什么

> 路由是指如何定义应用的端点（URIs）以及如何响应客户端的请求。
>
> 路由是由一个 URI、HTTP 请求（GET、POST等）和若干个句柄组成的。





### 2.Route的定义

> 我们可以将路由定义为三个部分：
>
> 第一部分：HTTP请求的方法（get或post）
>
> 第二部分：URI路径
>
> 第三部分: 回调函数



### 3 Route的实现

> Express中提供了一系列函数，可以让我们很方便的实现路由：
>
> app.<method>(path，callback) 
>
> ​		method指的是HTTP请求方法，比如 app.get()，app.post()
>
> ​		path指要通过回调函数来处理的URL地址
>
> ​		callback参数是应该处理该请求并把响应发回客户端的请求处理程序



```js
const express = require("express");
const fs = require("fs");
const app = express();

//创建路由规则
app.get("/", (request, response) => {
    //send 方法是 express 封装的响应的方法
    response.send("路由页面");
});

app.get("/admin", (request, response) => {
    response.send("后台网页");
});
//显示登录页面
app.get("/login", (request, response) => {
    const body = fs.readFileSync("./form.html");
    response.end(body);
});

app.get("/register", (request, response) => {
    response.send("注册页面");
});

app.post("/login", (request, response) => {
    response.send("登录处理");
});

app.listen(80);
```



```html
<!-- form.html -->
<form action="/login" method="post">
    <input type="text" name="username">
    <input type="text" name="password">
    <input type="submit" value="登录" >
</form>
```



### 4.Route的运行流程

> 当Express服务器接收到一个HTTP请求时，它会查找已经为适当的HTTP方法和路径定义的路由
>
> 如果找到一个，Request和Response对象会被创建，并被传递给路由的回调函数
>
> 我们便可以通过Request对象读取请求，通过Response对象返回响应
>
> Express中还提供了all()方法，可以处理两种请求。

```js
//all 方法  同时响应get和post
app.all("/test", (request, response) => {
    response.send("测试");
});
```





## 4. Request对象



### 1.Request对象是什么

> Request对象是路由回调函数中的第一个参数，代表了用户发送给服务器的请求信息
>
> 通过Request对象可以读取用户发送的请求包括URL地址中的查询字符串中的参数，和post请求的请求体中的参数。



### 2.Request对象的属性和方法

| 属性/方法         | 描述                                                 |
| ----------------- | ---------------------------------------------------- |
| request.query     | 获取get请求查询字符串的参数，拿到的是一个对象        |
| request.params    | 获取get请求参数路由的参数，拿到的是一个对象          |
| request.body      | 获取post请求体，拿到的是一个对象（要借助一个中间件） |
| request.get(xxxx) | 获取请求头中指定key对应的value                       |



### 3.使用

```js
//引入 express 包
const express = require("express");
//创建应用对象
const app = express();

//路由的设置
app.get("/", (request, response) => {
  //设置响应
  response.end("Hello Express");
});

app.get("/req", (request, response) => {
    //获取请求方法
    console.log(request.method);
    //获取请求的 URL
    console.log(request.url);
    //获取请求 HTTP 协议版本
    console.log(request.httpVersion);
    //获取请求头信息
    console.log(request.headers);
    //获取查询字符串参数
    console.log(request.query);
    //获取指定的请求头信息
    console.log(request.get("host"));
    response.send("请求内容的获取");
});

//1. url规则中填写占位符 (:标识符)
app.get("/news/:id.html", (request, response) => {
  //2. 获取 url 中的路径参数
  let id = request.params.id;
  console.log(id);
  response.send(`id 为 ${id} 的新闻`);
});

//仿京东的路由设置
app.get("/:abc.html", (request, response) => {
  let id = request.params.abc;
  response.send(`id 为 ${id} 的商品信息`);
});

//监听端口 启动服务
app.listen(80, () => {
  console.log("服务已经启动.. 端口 80 监听中....");
});
```



### 4.修改 hosts 文件

路径

```
C:\Windows\System32\drivers\etc\hosts
```

打开文件并编辑

```
127.0.0.1       item.jd.com
127.0.0.1       qq.com
```

最后保存文件

## 5.Response对象



### 1.Response对象是什么

> Response对象是路由回调函数中的第二个参数，代表了服务器发送给用户的响应信息。
>
> 通过Response对象可以设置响应报文中的各个内容，包括响应头和响应体。



### 2.Response对象的属性和方法

| 属性/方法                  | 描述                                       |
| -------------------------- | ------------------------------------------ |
| response.send()            | 给浏览器做出一个响应                       |
| response.end()             | 给浏览器做出一个响应（不会自动追加响应头） |
| response.download()        | 告诉浏览器下载一个文件                     |
| response.sendFile()        | 给浏览器发送一个文件                       |
| response.redirect()        | 重定向到一个新的地址（url）                |
| response.set(header,value) | 自定义响应头内容                           |
| response.get()             | 获取响应头指定key对应的value               |
| res.status(code)           | 设置响应状态码                             |



### 3.使用

```js
// 引入 express 包
const express = require("express");
// 创建应用对象
const app = express();
// 路由的设置
app.get("/res", (request, response) => {
    //响应状态码
    // response.statusCode = 200;
    response.status(500);
    //响应状态字符串
    response.statusMessage = "ok";
    //响应头
    // response.setHeader('week','san');
    // response.setHeader('Content-type','text/html;charset=utf-8');
    response.set("a", "100");
    //响应体
    // response.write('Hello');
    //设置响应 设置响应体之后, 就不能再设置响应头了
    response.send("断剑重铸之日，骑士归来之时");
    //下载响应
    response.download("./package.json");
    //将一个文件中的内容响应给浏览器 (必须为绝对路径)
    response.sendFile(__dirname + "/form.html");
    //跳转
    response.redirect("https://www.baidu.com");
});
// 监听端口 启动服务
app.listen(80, () => {
    console.log("服务已经启动.. 端口 80 监听中....");
});
```



### 4.网站根目录

> 网站根目录会放置
>
> * html 文件
> * css 文件
> * JS 文件
> * 图片
> * 视频
> * 音频
> * 字体
>
> 对于内容要频繁变化的资源, 设置路由规则响应网页内容

```js
//配置网站的根目录
app.use(express.static(__dirname + "/public"));
```



## 6.中间件



### 1.中间件简介

> Express 是一个自身功能极简，完全是由路由和中间件构成一个的 web 开发框架：从本质上来说，一个 Express 应用就是在调用各种中间件。
>
> 中间件（Middleware） 是一个函数，它可以访问请求对象（request）, 响应对象（response）, 和 web 应用中处于请求-响应循环流程中的中间件，一般被命名为 next 的变量。





### 2.中间件功能

1. 执行任何代码。
2. 修改请求和响应对象。
3. 终结请求-响应循环。
4. 调用堆栈中的下一个中间件。



### 3.中间件的分类

1. 应用级中间件（过滤非法的请求，例如防盗链）
2. 第三方中间件（通过npm下载的中间件，例如body-parser）
3. 内置中间件（express内部封装好的中间件）
4. 路由器中间件 （Router）





### 4.中间件的使用

> 时间处理插件
>
> http://momentjs.cn/

全局中间件

```js
// 中间件就是 函数
const express = require('express');
const moment = require('moment');
const fs = require('fs');

const app = express();

//1. 声明一个中间件函数  next 是一个函数类型的值,   console.log('记录');
let record = function(request, response, next){
    //获取时间  Date  getFulleYear  getMonth  getDate  
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    //获取路径
    const path = request.url;
    //拼接要写入的字符串
    let str = `[${time}]  ${path}\r\n`;
    //写入文件
    fs.writeFileSync('./access.log', str, {flag: 'a'});
    //调用 next 函数
    next();
}


//2. 使用中间件  中间件的配置 (全局中间件)
app.use(record)

// 路由
// 将用户的请求 记录在文件中 access.log   [2020-10-26 10:10:10]  / 
app.get('/', (request, response) => {
    response.send('中间件');
});

app.get('/admin', checkUser, (request, response) => {
    response.send('后台首页')
});

app.get('/setting', checkUser, (request, response) => {
    response.send('后台设置');
});

app.get('/shuju', checkUser, (request, response) => {
    response.send('后台数据页面');
});

app.get('/home', (request, response) => {
    response.send('前端首页');
})

app.get('/cart', (request, response) => {
    response.send('购物车');
});

app.get('/login', (request, response) => {
    response.send('登录页面');
});

app.listen(80);
```



路由中间件

```js
//一. 路由中间件 检测用户 127.0.0.1/admin?admin=1
let checkUser = function(request, response, next){
    //获取 admin url参数
    let isAdmin = request.query.admin;
    //判断
    if(isAdmin === '1'){
        //满足条件
        next();
    }else{
        //跳转登录页面
        response.redirect('/login');
    }
}

//二 添加函数至第二个参数
app.get('/admin', checkUser, (request, response) => {
    response.send('后台首页')
});
app.get('/setting', checkUser, (request, response) => {
    response.send('后台设置');
});
app.get('/home', (request, response) => {
    response.send('前端首页');
})
app.get('/cart', (request, response) => {
    response.send('购物车');
});
```



其他中间件

```js
// 引入 express 包
const express = require("express");
// 创建应用对象
const app = express();
//1> 引入 body-parser
var bodyParser = require("body-parser");
//2> parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//简易的自定义请求体处理中间件
let myBodyParser = function (request, response, next) {
  //获取请求体
  let body = "";
  绑定 data 事件
  request.on("data", (chunk) => {
    body += chunk.toString();
  });

  request.on("end", () => {
    //解析
    const data = qs.parse(body);
    //将请求体对象作为属性 存储到 request 对象中
    request.body = data;
    next();
  });
};

//1. 静态资源服务中间件
app.use(express.static("./public"));

//2. 请求体参数的获取 中间件  body-parser
app.get("/form", (request, response) => {
  //将某个文件中的内容 响应
  response.sendFile(__dirname + "/form.html");
});

app.post("/login", (request, response) => {
  //获取请求体 body-parser
  //3> request.body 获取请求体中的某个属性
  console.log(request.body.username);
  console.log(request.body.password);
  response.send("请求体接受完毕");
});

// 监听端口 启动服务
app.listen(80, () => {
  console.log("服务已经启动.. 端口 80 监听中....");
});
```





## 7.Router路由器



### 1.Router是什么

> Router 是一个完整的中间件和路由系统，也可以看做是一个小型的app对象。





### 2.为什么使用Router

> 为了更好的分类管理route



### 3.Router的使用

```js
// 安装 express
// 引入 express 包
const express = require("express");
// 创建应用对象
const app = express();
// 引入router
const router = require("./routes/router");
const adminRouter = require("./routes/admin");

//1. 创建一个 routes 文件夹
//2. 创建单独的文件 router.js
//3. 修改 router.js 中代码(四步)
//4. 主文件中引入 router.js
//5. app.use 设置中间件
app.use(router);
app.use(adminRouter);

// 监听端口 启动服务
app.listen(80, () => {
  console.log("服务已经启动.. 端口 80 监听中....");
});
```



```js
// router.js
//1. 引入 express 包
const express = require('express');
//2. 创建路由器对象  router 是一个微型的 app 对象
const router = express.Router();
//3. 路由规则
router.get('/admin', (request, response) => {
    response.send('<h1>后台首页</h1>')
});

router.get('/logout', (request, response) => {
    response.send('<h1>退出登录</h1>')
});

//4. 暴露
module.exports = router;
```

