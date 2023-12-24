## 简介

**前后端通信**

> 初识前后端通信
>
> 前后端通信的过程与概念解释
>
> 前后端的通信方式

**HTTP 协议**

> 初识 HTTP
>
> **HTTP 报文**
>
> HTTP 方法
>
> **GET 和 POST 方法的对比**
>
> HTTP 状态码
>
> HTTPS
>
> HTTP 缓存

## 1. 初识前后端通信

- 前后端通信是什么

- 后端向前端发送数据

- 前端向后端发送数据

### 1.前后端通信是什么

> 前端和后端数据交互的过程
>
> 浏览器和服务器之间数据交互的过程

### 2.后端向前端发送数据

> 访问页面

[![BTt6Ds.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/BTt6Ds.png)](https://imgchr.com/i/BTt6Ds)

### 3.前端向后端发送数据

> 用户注册

[![BTNkIP.png](https://s1.ax1x.com/2020/11/08/BTNkIP.png)](https://imgtu.com/i/BTNkIP)

## 2. 前后端通信的过程与概念解释

- 前后端通信的过程

- 概念解释

### 1.前后端通信的过程

> 前后端的通信是在“请求-响应”中完成的

[![DHvYUH.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DHvYUH.png)](https://imgchr.com/i/DHvYUH)

### 2.概念解释

> 前端：浏览器端
>
> 客户端：只要能和服务器通信的就叫客户端
>
>  命令行工具
> ​
>
> 后端：服务器端

## 3. 前后端的通信方式

- 使用浏览器访问网页

- HTML 的标签

- Ajax 和 Fetch

### 1.使用浏览器访问网页

> 在浏览器地址栏输入网址，按下回车

### 2.HTML 的标签

> 浏览器在解析 HTML 标签的时候，遇到一些特殊的标签，会再次向服务器发送请求
>
> **link / img / script / iframe**

[![BTUW1U.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/BTUW1U.png)](https://imgchr.com/i/BTUW1U)

[![BTaF9f.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/BTaF9f.png)](https://imgchr.com/i/BTaF9f)

**还有一些标签，浏览器解析的时候，不会向服务器发送请求，但是用户可以使用他们向服务器发送请求**

> a/form

```html
<a href="https://www.bilibili.com">bilibili一下</a>

<form action="https://www.shiguangkey.com/" method="POST">
  <input type="text" name="username" placeholder="用户名" />
  <input type="password" name="password" placeholder="密码" />
  <input type="submit" value="注册" />
</form>
```

### 3.Ajax 和 Fetch

## 4. 初识 HTTP

### 1.HTTP 是什么

> HyperText Transfer Protocol 超文本传输协议，是一种基于 TCP/IP 的应用层通信协议，这个协议详细规定了浏览器和万维网服务器之间互相通信的规则
>
> HTML：超文本标记语言
>
> **超文本：原先一个个单一的文本，通过超链接将其联系起来。由原先的单一的文本变成了可无限延伸、扩展的超级文本、立体文本**
>
> HTML、JS、CSS、图片、字体、音频、视频等等文件，都是通过 HTTP（超文本传输协议） 在服务器和浏览器之间传输
>
> 每一次前后端通信，前端需要主动向后端发出请求，后端接收到前端的请求后，可以给出响应
>
> HTTP 是一个请求-响应协议

### 2.HTTP 请求响应的过程

[![BTdoJx.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/BTdoJx.png)](https://imgchr.com/i/BTdoJx)

## 5. HTTP 报文

> 客户端向服务器发送数据，称之为`请求报文`
>
> 服务器向客户端返回数据，称之为`响应报文`

### 1. 请求报文

HTTP 请求报文包括四部分

- 请求行
- 请求头
- 空行
- 请求体

```http
请求行：
GET http://localhost:3000/index.html?username=sunwukong&password=123123 HTTP/1.1

请求头：
Host: localhost:3000
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9
Cookie: BD_UPN=1126314751; BD_HOME=1
```

#### 请求行

```
GET http://localhost:3000/index.html?username=sunwukong&password=123123 HTTP/1.1
```

- GET 请求方式 常见的 HTTP 的请求方法: GET 和 POST (PUT DELETE PATCH)
- http://localhost:3000/index.html?username=sunwukong&password=123#logo 请求的 URL
  - https/http/mongodb/ftp/ssh 协议
  - localhost 域名
  - :3000 端口
  - /index.html 路径
  - username=sunwukong&password=123 查询字符串
  - #logo 锚点
- HTTP/1.1 HTTP 协议的版本

#### 请求头

> 格式: 『请求头的名字: 请求头的值』

- Host: localhost:3000： 请求的主机名为 localhost，端口号 3000
- Connection: keep-alive： 处理完这次请求后继续保持连接
- Pragma: no-cache： 不缓存该资源，http 1.0 的规定
- Cache-Control: no-cache： 不缓存该资源 http 1.1 的规定，优先级更高
- Upgrade-Insecure-Requests: 强制浏览器发送请求时使用 https
- User-Agent 客户端的字符串标志
- Accept 表明客户端所能接受的数据的类型
- Accept-Encoding 表明客户端支持的压缩方式
- Accept-Language ：当前客户端支持的语言类型
- Cookie 浏览器存储数据的一种方式，自动随着浏览器每次请求发送到服务器端

#### 请求体

form 表单

```html
<form method="post">
  <input name="login_email" />
  <input name="login_password" />
  <input type="submit" value="登录" />
</form>
```

请求体内容

```js
login_email=yunmu@qq.com&login_password=GREM9pus.fek-soos
```

> 请求体的格式是非常灵活的, 不限于为 url 的查询字符串形式, 『任意格式都可以』.
> 『JSON』与『URL 查询字符串』两种形式用的较多

### 2. 响应报文

HTTP 响应报文也包括四个部分

- 响应行
- 响应头
- 空行
- 响应体

```http
响应行：
HTTP/1.1 200 OK

响应头：
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Connection: keep-alive
Last-Modified: Wed, 21 Mar 2018 13:13:13 GMT
ETag: W/"a9-16248b12b64"
Content-Type: text/html; charset=UTF-8
Content-Length: 169
Date: Thu, 22 Mar 2018 12:58:41 GMT
Connection: keep-alive
Expires: Sat, 07 Nov 2020 03:08:03 GMT
X-Ua-Compatible: IE=Edge,chrome=1
Server: BWS/1.1
Strict-Transport-Security: max-age=172800
Traceid: 1604718483242292455417596420134845548989
Set-Cookie: BDSVRTM=12; path=/

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>首页</title>
</head>
<body>
  <h1>网站首页</h1>
</body>
</html>
```

#### 响应行

```
HTTP/1.1 200 OK
```

- HTTP/1.1 协议的版本
- 200 响应的状态码
- OK 响应的状态字符串

#### 响应头

> 响应头格式与请求头格式一致 『名字: 值』

- HTTP/1.1 200 OK： 协议是 HTTP 1.1 版本，请求响应成功
- X-Powered-By: Express：自定义的头，表示用的框架，一般不返回容易造成安全漏洞。
- Accept-Ranges: bytes： 告诉浏览器支持多线程下载
- Cache-Control: public, max-age=0：强制对所有静态资产进行缓存，即使它通常不可缓存。max-age 指定多久缓存一次
- Last-Modified: Wed, 21 Mar 2018 13:13:13 GMT：这个资源最后一次被修改的日期和时间
- ETag 请求资源的标记/ID
- Content-Length 响应体的长度
- Date 响应时间
- Expires 过期时间
- Connection 连接设置
- Server 服务器信息
- Set-Cookie 服务端设置 cookie
- Traceid 跟踪 id
- X-Ua-Compatible IE=Edge,chrome=1 强制 IE 浏览器使用最新的解析器解析网页, 使用 chrome 的内核解析网页
- Content-Type 返回响应体资源类型
  - https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types
  - text/html 表明响应体为 HTML 内容
  - text/css 表明响应体为 CSS 内容
  - application/javascript 表明响应体为 JavaScript
  - image/png 表明响应体为 png 的图片

**常见的响应状态码**

> 定义服务器对请求的处理结果，是服务器返回的

- 200 成功
- 301 永久重定向（配合 location ，浏览器自动处理)
- 302 临时重定向（配合 location ，浏览器自动处理)
- 304 资源未被修改 Not Modified 浏览器将会读取缓存
- 403 没有权限
- 404 找不到资源，说明客户端错误的请求了不存在的资源
- 403 禁止的 forbidden
- 500 服务器内部错误
- 504 网关超时

响应状态码 MDN 地址 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status

> 100~199 信息响应：代表请求已被接受，需要继续处理
> 200~299 成功响应
> 300~399 重定向
> 400~499 客户端错误
> 500~599 服务器错误

#### 响应体

响应体格式比较灵活, 场景的格式有

- HTML
- JavaScript
- CSS
- JSON
- 图片

### 3. WEB 服务

使用 nodejs 创建 HTTP 服务器

```js
//1. 引入 http 模块
const http = require("http");

//2. 调用方法 创建服务对象
const server = http.createServer(function (request, response) {
  response.end("Hello Everyone H5200826");
});

//3. 监听端口 启动服务
server.listen(80, function () {
  console.log("服务已经启动, 端口 80 监听中.....");
});
```

- request 是对请求报文的封装对象
- response 是对响应的封装对象

#### 获取请求

```js
//引入 http 模块
const http = require("http");
//引入 url 模块
const url = require("url");

//调用方法 创建服务对象  http://192.169.20.41/s?word=干啥呢
const server = http.createServer(function (request, response) {
  //获取请求报文中的内容  GET   /s?wd=关键字  HTTP/1.1
  // 1. 请求的类型
  console.log(request.method);
  // 2. 请求的 URL
  console.log(request.url);
  // 3. HTTP 协议版本
  console.log(request.httpVersion);
  // 4.获取 URL 中的路径部分
  // 调用方法获取参数
  console.log(url.parse(request.url).pathname);
  // 5. 获取查询字符串转换为对象形式
  console.log(url.parse(request.url, true).query);
  // 6. 获取请求头
  console.log(request.headers);
  // 7. 获取请求体
  // 提取请求体数据  POST 请求
  // 7.1 声明一个字符串变量
  let body = "";
  // 7.2 绑定 data 事件
  request.on("data", (chunk) => {
    //拼接
    body += chunk.toString();
  });
  // 7.3 绑定 end 事件
  request.on("end", () => {
    console.log(body);
    //调用 qs 对象的方法
    console.log(qs.parse(body));
    response.end("body recevied");
  });
  // 8. 响应query参数
  console.log(url.parse(request.url, true).query.word);
  response.end(url.parse(request.url, true).query.word);
});

//监听端口 启动服务
server.listen(80, function () {
  console.log("服务已经启动, 端口 80 监听中.....");
});
```

#### 设置响应

```js
require("http")
  .createServer((request, response) => {
    //响应行
    //状态码
    response.statusCode = 404;
    response.statusCode = 500;
    //状态字符串
    response.statusMessage = "TEST";
    //响应头
    response.setHeader("Content-type", "text/html;charset=utf-8");
    //自定义头信息
    response.setHeader("abc", "1000");
    //响应体 (响应体不能为空)
    response.write("11111");
    response.write("22222");
    response.write("33333");
    response.write("44444");
    //结束
    response.end();
  })
  .listen(80);
```

### 练习一

> 创建一个 HTTP 服务, 访问的时候, 返回一个粉色背景的界面, 顺便加一个标题, 标题内容
>
> 『菩提本无树, 明镜亦非台, 本来无一物, 何处惹尘埃』

```js
const http = require("http");
const url = require("url");
const server = http.createServer((request, response) => {
  //设置响应头
  response.setHeader("Content-Type", "text/html;charset=utf-8");
  // 获取请求 url 中的 『bg』参数
  let bg = url.parse(request.url, true).query.bg ? url.parse(request.url, true).query.bg : "#edf";
  //设置响应体
  response.end(`
        <!doctype html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body{
                    background: ${bg};
                }
            </style>
        </head>
        <body>
            <h1>
               菩提本无树, 明镜亦非台, 本来无一物, 何处惹尘埃
            </h1>
        </body>
        </html>

    `);
});

server.listen(80);
```

### 练习二

> 根据路径返回不同的页面
>
> GET /login 响应体返回 『登录页面』
>
> GET /register 响应体返回 『注册页面』
>
> POST /register 获取用户信息保存
>
> 「路径练习」https://www.aliyundrive.com/s/XstTJHYq71E

```js
// /login?a=100&b=200
// url.parse(request.url, true).pathname

const http = require("http");
const url = require("url");
//引入 fs 模块
const fs = require("fs");
const qs = require("querystring");
const server = http.createServer((request, response) => {
  //获取内容
  let { method } = request;
  let { pathname } = url.parse(request.url, true);
  //添加响应头
  response.setHeader("Content-type", "text/html;charset=utf-8");
  //判断登录
  if (method.toUpperCase() === "GET" && pathname === "/login") {
    //设置响应体
    response.end(fs.readFileSync(__dirname + "/login.html"));
  } else if (method.toUpperCase() === "GET" && pathname === "/register") {
    //注册
    response.end(fs.readFileSync(__dirname + "/register.html"));
  } else if (method.toUpperCase() === "POST" && pathname === "/register") {
    //注册用户的信息提取
    //1. 声明变量
    let body = "";
    //2. 绑定 data 事件
    request.on("data", (chunk) => {
      body += chunk;
    });
    //3. 绑定end事件
    request.on("end", () => {
      //将用户的字符串信息转化为 对象
      const data = qs.parse(body);
      //所有的用户信息读取出来
      const users = fs.readFileSync("./users.json").toString();
      //将字符串转化为对象
      const usersObj = JSON.parse(users);
      //将新用户的对象压入到 usersObj 对象
      usersObj.data.push(data);
      //将对象转化为JSON字符串
      let str = JSON.stringify(usersObj);
      //存储新的数据
      fs.writeFileSync("./users.json", str);
      response.end("恭喜恭喜 注册成功");
    });
  } else {
    response.end("<h1>404 Not Found</h1>");
  }
});

server.listen(80);
```

### 练习三

> 搭建 HTTP 服务.
>
> GET /table 响应一个表格 4 行 3 列表格, 并实现隔行换色 (JS)

```js
// table.js
const http = require("http");
const url = require("url");
const fs = require("fs");
const server = http.createServer((request, response) => {
  //读取 table.html 的文件内容
  const data = fs.readFileSync(__dirname + "/table.html");
  response.end(data);
});

server.listen(80); //fff    focus  fixed  feedback
```

```html
//table.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>隔行换色效果</title>
    <style>
      table {
        border-collapse: collapse;
      }
      td {
        padding: 10px 20px;
      }
    </style>
  </head>

  <body>
    <table border="1">
      <tr>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
      <tr>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
        <td>1</td>
      </tr>
    </table>

    <script>
      //获取所有的 tr 元素
      const trs = document.querySelectorAll("tr");
      //遍历
      for (let i = 0; i < trs.length; i++) {
        //判断
        if (i % 2 === 0) {
          trs[i].style.background = "#156";
        } else {
          trs[i].style.background = "#aef";
        }
      }
    </script>
  </body>
</html>
```

### 练习四

> 响应一个表格 N 行 3 列表格

```js
const data = [
  {
    id: 1,
    name: "刘德华",
    song: "冰雨",
  },
  {
    id: 2,
    name: "周杰伦",
    song: "不能说的密码",
  },
  {
    id: 3,
    name: "林俊杰",
    song: "不为谁而作的歌",
  },
  {
    id: 4,
    name: "五月天",
    song: "干杯",
  },
  {
    id: 5,
    name: "张艺兴",
    song: "莲",
  },
  {
    id: 6,
    name: "刘德华",
    song: "冰雨",
  },
  {
    id: 7,
    name: "张学友",
    song: "情人",
  },
];

//
const http = require("http");
const url = require("url");
const fs = require("fs");
const server = http.createServer((request, response) => {
  //获取路径
  let pathname = decodeURI(url.parse(request.url, true).pathname);
  // 如果请求路径为 /songs 则响应 HTML 的表格
  if (pathname === "/songs") {
    //响应表格
    // response.end(fs.readFileSync('./table-songs.html'));
    //将数组进行 tr 标签拼接
    // { id:1, name: '刘德华', song: '冰雨' }  =>  <tr><td>1</td><td>刘德华</td><td>冰雨</td></tr>
    let trs = "";
    //遍历数组
    for (let i = 0; i < data.length; i++) {
      trs += `<tr><td>${data[i].id}</td><td>${data[i].name}</td><td>${data[i].song}</td></tr>`;
    }

    response.end(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                    table,td{
                        border-collapse:collapse;
                    }
                    td{
                        padding:20px;
                    }
                </style>
            </head>
            <body>
                <table border="1">
                    <tr><td>ID</td><td>歌手</td><td>歌曲</td></tr>
                    ${trs}
                </table>
                <script src="/abc.html"></script>
            </body>
            </html>
        `);
  } else if (pathname === "/abc.html") {
    //响应各行换色的 JS 内容
    let JS = fs.readFileSync("./隔行换色.js");
    //响应 JS 代码
    response.end(JS);
  } else {
    response.end("404 Not Found");
  }
});

server.listen(80);
```

### 练习五

> GET /index.html public/index.html 响应一个文件中的内容
>
> GET /css/app.css public/css/app.css 响应文件内容
>
> GET /css/home.css public/css/home.css 响应文件内容
>
> GET /js/app.js public/js/app.js 响应文件内容

```js
//1. 引入 http 模块
const http = require("http");
const url = require("url");
const fs = require("fs");
//2. 创建服务对象 create 创建  server 服务
const server = http.createServer(function (request, response) {
  //获取路径
  let pathname = url.parse(request.url, true).pathname;
  //判断
  if (pathname === "/index.html") {
    //读取 public/index.html 文件中的内容
    let html = fs.readFileSync(__dirname + "/public/index.html");
    response.end(html);
  } else if (pathname === "/css/app.css") {
    let html = fs.readFileSync(__dirname + "/public/css/app.css");
    response.end(html);
  } else if (pathname === "/css/home.css") {
    let html = fs.readFileSync(__dirname + "/public/css/home.css");
    response.end(html);
  } else if (pathname === "/js/app.js") {
    let html = fs.readFileSync(__dirname + "/public/js/app.js");
    response.end(html);
  } else {
    response.statusCode = 404;
    response.end("Not Found");
  }
});

//3. 监听端口, 启动服务
server.listen(80, function () {});
```

**改进**

```js
//1. 引入 http 模块
const http = require("http");
const url = require("url");
const fs = require("fs");

//2. 创建服务对象 create 创建  server 服务
const server = http.createServer(function (request, response) {
  //获取路径   /index.html
  let pathname = url.parse(request.url, true).pathname;
  //  /index.html   =>  __dirname + '/public/index.html'
  // 网站的根目录  服务根据请求路径到『指定文件夹』下找文件, 那么这个『指定的文件夹』就是网站的根目录
  // let directory = __dirname + '/public';
  let directory = __dirname + "/public";
  let filePath = directory + pathname;
  //读取文件内容  D:/...../public/index.html
  fs.readFile(filePath, (err, data) => {
    //如果有错误
    if (err) {
      //404 响应
      response.statusCode = 404;
      response.end("<h1>404 Not Found</h1>");
    } else {
      //响应文件内容
      response.end(data);
    }
  });
});

//3. 监听端口, 启动服务
server.listen(80, function () {});
```

### 练习六

> GET /news 创建一个服务，显示一个新闻列表

```js
const http = require("http");
const url = require("url");
const fs = require("fs");

//获取 JSON 数据
const data = fs.readFileSync("./data.json").toString();
const newsData = JSON.parse(data);

const server = http.createServer((request, response) => {
  //获取请求的类型
  let { method } = request;
  console.log(method);
  //获取请求的路径
  let pathname = url.parse(request.url, true).pathname;
  if (method === "GET" && pathname === "/news") {
    //响应『新闻列表』
    // let body = fs.readFileSync("./news.html");
    //拼接 新闻的 HTML 结构
    let str = "";
    //遍历数组
    for (let i = 0; i < newsData.data.length; i++) {
      str += `<div class="media">
                        <div class="media-left">
                            <a target="_blank" href="https://www.toutiao.com${
                              newsData.data[i].source_url
                            }">
                                <img class="media-object" src="${newsData.data[i].image_url}" />
                            </a>
                        </div>
                        <div class="media-body">
                            <h4 class="media-heading title" >${newsData.data[i].title}</h4>
                            <p>
                            ${newsData.data[i].abstract ? newsData.data[i].abstract : ""}
                            </p>
                        </div>
                    </div>`;
    }

    response.end(`<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>新闻列表 | H5200826</title>
            <link crossorigin='anonymous' href="https://cdn.bootcss.com/twitter-bootstrap/3.3.7/css/bootstrap.min.css"
                rel="stylesheet">
            <style>
                .title{
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                body{
                    background:#889;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="row">
                    <div class="col-xs-6 col-xs-offset-3">
                        <h2 class="page-header">新闻列表</h2>
                        ${str}
                    </div>
                </div>
            </div>
        </body>
        
        </html>`);
  } else {
    response.statusCode = 404;
    response.end("404");
  }
});

server.listen(80);
```

```json
// data.json
{
  "has_more": true,
  "message": "success",
  "data": [
    {
      "is_feed_ad": false,
      "tag_url": "search/?keyword=None",
      "ugc_data": {
        "read_count": 2489685,
        "ugc_images": [
          "//p1.pstatp.com/list/240x240/tos-cn-i-0022/b8720df389e74862bfd478bf1fcb5d2b"
        ],
        "ugc_user": {
          "open_url": "/c/user/token/MS4wLjABAAAAiAce5qhH31TeuB3UdpFMV8u-uwy2LnoiqI10uZHqAt8/",
          "user_id": 5757425042,
          "name": "\u65b0\u534e\u793e",
          "avatar_url": "https://sf1-ttcdn-tos.pstatp.com/img/mosaic-legacy/ffbc0000ad1e717b76a6~120x256.image",
          "is_following": false,
          "is_self": false,
          "user_verified": 1,
          "user_auth_info": {
            "auth_type": "0",
            "auth_info": "\u65b0\u534e\u793e\u5b98\u65b9\u8d26\u53f7"
          }
        },
        "rich_content": "\u3010\u5916\u4ea4\u90e8\uff1a\u6ce8\u610f\u5230\u62dc\u767b\u5df2\u5ba3\u5e03\u5f53\u9009 \u4e2d\u65b9\u5c06\u6309\u7167\u56fd\u9645\u60ef\u4f8b\u529e\u7406\u3011\u5916\u4ea4\u90e8\u53d1\u8a00\u4eba\u6c6a\u6587\u658c9\u65e5\u5728\u4f8b\u884c\u8bb0\u8005\u4f1a\u4e0a\u8bf4\uff0c\u4e2d\u65b9\u6ce8\u610f\u5230\u62dc\u767b\u5148\u751f\u5df2\u7ecf\u5ba3\u5e03\u6210\u529f\u5f53\u9009\uff0c\u201c\u6211\u4eec\u7406\u89e3\uff0c\u5927\u9009\u7684\u7ed3\u679c\u4f1a\u6309\u7167\u7f8e\u56fd\u7684\u6cd5\u5f8b\u548c\u7a0b\u5e8f\u4f5c\u51fa\u786e\u5b9a\u3002\u201d\u88ab\u95ee\u53ca\u4e2d\u65b9\u4f55\u65f6\u4f1a\u53d1\u53bb\u8d3a\u7535\uff0c\u6c6a\u6587\u658c\u8868\u793a\uff0c\u4e2d\u65b9\u5c06\u6309\u7167\u56fd\u9645\u60ef\u4f8b\u529e\u7406\u3002\u201c\u6211\u4eec\u5386\u6765\u4e3b\u5f20\u4e2d\u7f8e\u53cc\u65b9\u5e94\u8be5\u52a0\u5f3a\u6c9f\u901a\u5bf9\u8bdd\uff0c\u5728\u76f8\u4e92\u5c0a\u91cd\u7684\u57fa\u7840\u4e0a\u7ba1\u63a7\u5206\u6b67\uff0c\u5728\u4e92\u60e0\u4e92\u5229\u7684\u57fa\u7840\u4e0a\u62d3\u5c55\u5408\u4f5c\uff0c\u63a8\u52a8\u4e2d\u7f8e\u5173\u7cfb\u5065\u5eb7\u7a33\u5b9a\u53d1\u5c55\u3002\u201d\uff08\u8bb0\u8005\u6210\u6b23\uff09",
        "show_count": 2489685,
        "digg_count": 1757,
        "content": "\u3010\u5916\u4ea4\u90e8\uff1a\u6ce8\u610f\u5230\u62dc\u767b\u5df2\u5ba3\u5e03\u5f53\u9009 \u4e2d\u65b9\u5c06\u6309\u7167\u56fd\u9645\u60ef\u4f8b\u529e\u7406\u3011\u5916\u4ea4\u90e8\u53d1\u8a00\u4eba\u6c6a\u6587\u658c9\u65e5\u5728\u4f8b\u884c\u8bb0\u8005\u4f1a\u4e0a\u8bf4\uff0c\u4e2d\u65b9\u6ce8\u610f\u5230\u62dc\u767b\u5148\u751f\u5df2\u7ecf\u5ba3\u5e03\u6210\u529f\u5f53\u9009\uff0c\u201c\u6211\u4eec\u7406\u89e3\uff0c\u5927\u9009\u7684\u7ed3\u679c\u4f1a\u6309\u7167\u7f8e\u56fd\u7684\u6cd5\u5f8b\u548c\u7a0b\u5e8f\u4f5c\u51fa\u786e\u5b9a\u3002\u201d\u88ab\u95ee\u53ca\u4e2d\u65b9\u4f55\u65f6\u4f1a\u53d1\u53bb\u8d3a\u7535\uff0c\u6c6a\u6587\u658c\u8868\u793a\uff0c\u4e2d\u65b9\u5c06\u6309\u7167\u56fd\u9645\u60ef\u4f8b\u529e\u7406\u3002\u201c\u6211\u4eec\u5386\u6765\u4e3b\u5f20\u4e2d\u7f8e\u53cc\u65b9\u5e94\u8be5\u52a0\u5f3a\u6c9f\u901a\u5bf9\u8bdd\uff0c\u5728\u76f8\u4e92\u5c0a\u91cd\u7684\u57fa\u7840\u4e0a\u7ba1\u63a7\u5206\u6b67\uff0c\u5728\u4e92\u60e0\u4e92\u5229\u7684\u57fa\u7840\u4e0a\u62d3\u5c55\u5408\u4f5c\uff0c\u63a8\u52a8\u4e2d\u7f8e\u5173\u7cfb\u5065\u5eb7\u7a33\u5b9a\u53d1\u5c55\u3002\u201d\uff08\u8bb0\u8005\u6210\u6b23\uff09",
        "comment_count": 83,
        "show_text": "\u5c55\u73b0",
        "display_count": 2489685
      },
      "title": "\u3010\u5916\u4ea4\u90e8\uff1a\u6ce8\u610f\u5230\u62dc\u767b\u5df2\u5ba3\u5e03\u5f53\u9009 \u4e2d\u65b9\u5c06\u6309\u7167\u56fd\u9645\u60ef\u4f8b\u529e\u7406\u3011\u5916\u4ea4\u90e8\u53d1\u8a00\u4eba\u6c6a\u6587\u658c9\u65e5\u5728\u4f8b\u884c\u8bb0\u8005\u4f1a\u4e0a\u8bf4\uff0c\u4e2d\u65b9\u6ce8\u610f\u5230\u62dc\u767b\u5148\u751f\u5df2\u7ecf\u5ba3\u5e03\u6210\u529f\u5f53\u9009\uff0c\u201c\u6211\u4eec\u7406\u89e3\uff0c\u5927\u9009\u7684\u7ed3\u679c\u4f1a\u6309\u7167\u7f8e\u56fd\u7684\u6cd5\u5f8b\u548c\u7a0b\u5e8f\u4f5c\u51fa\u786e\u5b9a\u3002\u201d\u88ab\u95ee\u53ca\u4e2d\u65b9\u4f55\u65f6\u4f1a\u53d1\u53bb\u8d3a\u7535\uff0c\u6c6a\u6587\u658c\u8868\u793a\uff0c\u4e2d\u65b9\u5c06\u6309\u7167\u56fd\u9645\u60ef\u4f8b\u529e\u7406\u3002\u201c\u6211\u4eec\u5386\u6765\u4e3b\u5f20\u4e2d\u7f8e\u53cc\u65b9\u5e94\u8be5\u52a0\u5f3a\u6c9f\u901a\u5bf9\u8bdd\uff0c\u5728\u76f8\u4e92\u5c0a\u91cd",
      "single_mode": false,
      "middle_mode": true,
      "tag": "forum_post",
      "behot_time": 1604910487,
      "source_url": "/group/1682891293361175/",
      "source": "\u65b0\u534e\u793e",
      "more_mode": false,
      "article_genre": "ugc",
      "image_url": "//p1.pstatp.com/list/tos-cn-i-0022/b8720df389e74862bfd478bf1fcb5d2b",
      "has_gallery": false,
      "group_source": 5,
      "item_id": "1682891293361175",
      "comments_count": 83,
      "group_id": "1682891293361175",
      "middle_image": "http://p1.pstatp.com/list/tos-cn-i-0022/b8720df389e74862bfd478bf1fcb5d2b",
      "media_url": "/c/user/token/MS4wLjABAAAAiAce5qhH31TeuB3UdpFMV8u-uwy2LnoiqI10uZHqAt8/"
    },
    {
      "single_mode": true,
      "abstract": "\u5fb7\u826f\u7626\u5c0f\uff0c\u4e00\u7c73\u56db\u51fa\u5934\u7684\u4e2a\u5b50\uff0c\u5934\u53d1\u7a00\u758f\u7070\u767d\u3002\u4e0d\u7b11\u65f6\uff0c\u7709\u5934\u5448\u201c\u51e0\u201d\u5b57\u5f62\uff0c\u773c\u7a9d\u6df1\u9677\u3001\u524d\u989d\u9ad8\u8038\u5bbd\u5927\uff0c\u662f\u5e03\u4f9d\u65cf\u4eba\u7684\u5178\u578b\u7279\u5f81\u300210\u670817\u65e5\u665a\u4e0a\u4e03\u70b9\uff0c\u88ab\u62d0\u5356\u4e09\u5341\u4e94\u5e74\u540e\uff0c59\u5c81\u7684\u5e03\u4f9d\u65cf\u5987\u5973\u5fb7\u826f\u89c1\u5230\u4e86\u5bb6\u4eba\u3002\u5728\u8d35\u5dde\u9ed4\u897f\u5357\u5e03\u4f9d\u65cf\u82d7\u65cf\u81ea\u6cbb\u5dde\u6c99\u5b50\u9547\u4e00\u680b\u6c11\u5c45\u524d\uff0c\u5305\u62ec\u4eb2\u621a\u670b\u53cb\u3001\u8857\u574a\u90bb\u5c45\u5728\u5185\u7684\u51e0\u5341\u4eba\u7b49\u7740\u5979\u3002",
      "middle_mode": true,
      "more_mode": true,
      "tag": "news_society",
      "comments_count": 2946,
      "tag_url": "news_society",
      "title": "\u88ab\u62d0\u5356\u5230\u6cb3\u535735\u5e74\u7684\u5e03\u4f9d\u65cf\u5973\u5b50\uff1a\u59cb\u7ec8\u5b66\u4e0d\u4f1a\u6c49\u8bed\uff0c\u88ab\u8ba4\u4e3a\u662f\u54d1\u5df4",
      "chinese_tag": "\u793e\u4f1a",
      "source": "\u65b0\u4eac\u62a5",
      "group_source": 2,
      "has_gallery": false,
      "media_url": "/c/user/token/MS4wLjABAAAAzHj3Nx8o7swEMOeE61Y8tzeXORNWzcXvBa7NNxQhSFg/",
      "media_avatar_url": "//p26-tt.byteimg.com/large/pgc-image/9c0653fac68b4cb68a58898eddcca7f6",
      "image_list": [
        {
          "url": "//p1.pstatp.com/list/pgc-image/SFNC67mCQjbM8H"
        },
        {
          "url": "//p1.pstatp.com/list/pgc-image/SFNC69LGZYfKV3"
        },
        {
          "url": "//p1.pstatp.com/list/pgc-image/SFNC6A3CWRCidF"
        }
      ],
      "source_url": "/group/6891237833768600077/",
      "article_genre": "article",
      "item_id": "6891237833768600077",
      "is_feed_ad": false,
      "behot_time": 1604909189,
      "image_url": "//p1.pstatp.com/list/190x124/pgc-image/SFNC67mCQjbM8H",
      "group_id": "6891237833768600077",
      "middle_image": "http://p1.pstatp.com/list/pgc-image/SFNC67mCQjbM8H"
    },
    {
      "single_mode": false,
      "abstract": "\u201c\u623f\u5b50\u4e00\u62c6\u8fc1\u3002\u624b\u91cc\u4e00\u5171\u67099\u5957\u3002\u6211\u51c6\u5907\u5230\u65b0\u7586\u3001\u897f\u85cf\u3001\u6f20\u6cb3\u3002\u4e00\u5b9a\u8981\u628a\u7956\u56fd\u8f6c\u4e00\u8f6c\u201d\u8ba9\u9752\u5c9b\u4e00\u5bf9\u592b\u5987\u4e0a\u4e86\u70ed\u641c\u3002",
      "middle_mode": true,
      "more_mode": true,
      "tag": "news_house",
      "comments_count": 1212,
      "tag_url": "search/?keyword=%E6%88%BF%E4%BA%A7",
      "title": "\u9752\u5c9b\u4e00\u5bf9\u592b\u59bb\u6210\u62c6\u8fc1\u7f51\u7ea2\uff01\u624b\u91cc9\u5957\u623f\uff0c\u5f00\u7740\u623f\u8f66\u6e38\u904d\u5168\u56fd\uff01\u8fd9\u4e48\u591a\u623f\u5b50\u2026\u548b\u6765\u7684",
      "chinese_tag": "\u623f\u4ea7",
      "source": "\u73af\u7403\u7f51",
      "group_source": 2,
      "has_gallery": false,
      "media_url": "/c/user/token/MS4wLjABAAAAvazHMceCo3MeM9IJbll231AC8GkJDcrd__iZFw2hi4o/",
      "media_avatar_url": "//p26-tt.byteimg.com/large/pgc-image/377d80150d1d4f2498e106b97cba7995",
      "image_list": [
        {
          "url": "//p3.pstatp.com/list/pgc-image/SFpAPsc5zxfZuG"
        },
        {
          "url": "//p3.pstatp.com/list/pgc-image/SFpAPuSGwjDzxT"
        },
        {
          "url": "//p3.pstatp.com/list/pgc-image/SFpAPv42Jcksiz"
        }
      ],
      "source_url": "/group/6893013094432244231/",
      "article_genre": "article",
      "item_id": "6893013094432244231",
      "is_feed_ad": false,
      "behot_time": 1604907877,
      "image_url": "//p3.pstatp.com/list/pgc-image/SFpAPsc5zxfZuG",
      "group_id": "6893013094432244231",
      "middle_image": "http://p3.pstatp.com/list/pgc-image/SFpAPsc5zxfZuG"
    },
    {
      "single_mode": true,
      "abstract": "\u6bcf\u5f53\u5468\u4e8c\u4e0b\u5348\uff0c\u7535\u89c6\u673a\u91cc\u4f1a\u51c6\u65f6\u51fa\u73b0\u8fd9\u4e2a\u753b\u9762\uff0c\u8ba9\u4f60\u9677\u5165\u201c\u6ca1\u6709\u7535\u89c6\u8282\u76ee\u201d\u7684\u6050\u60e7\u4e2d\u3002\u90a3\u4e48\uff0c\u8fd9\u4e2a\u82b1\u82b1\u7eff\u7eff\u7684\u201c\u76d8\u5b50\u201d\u662f\u4ec0\u4e48?\u771f\u7684\u662f\u5c0f\u65f6\u5019\u60f3\u7684\u90a3\u6837\u201c\u7535\u89c6\u574f\u4e86\u201d\u5417?",
      "middle_mode": true,
      "more_mode": true,
      "tag": "news",
      "comments_count": 354,
      "tag_url": "search/?keyword=%E5%85%B6%E5%AE%83",
      "title": "\u8fd9\u4e2a\u82b1\u82b1\u7eff\u7eff\u7684\u5706\u76d8\u5b50\uff0c\u85cf\u7740\u4f60\u4e0d\u77e5\u9053\u7684\u79d8\u5bc6",
      "chinese_tag": "\u5176\u5b83",
      "source": "\u5149\u660e\u7f51",
      "group_source": 2,
      "has_gallery": false,
      "media_url": "/c/user/token/MS4wLjABAAAA9Lz0MeLdJDmqpU26Xi9O_M-cYI9z530wjM7eDKvzZTw/",
      "media_avatar_url": "//p9-tt-ipv6.byteimg.com/large/pgc-image/1f702ff89f9e4c45a2c23c6bb607309e",
      "image_list": [
        {
          "url": "//p1.pstatp.com/list/pgc-image/SDrYYXn2d0d3G4"
        },
        {
          "url": "//p1.pstatp.com/list/pgc-image/SDrYYZx4XKY9K1"
        },
        {
          "url": "//p9.pstatp.com/list/pgc-image/SDrYYaL9SM1f21"
        }
      ],
      "source_url": "/group/6885295180975440392/",
      "article_genre": "article",
      "item_id": "6885295180975440392",
      "is_feed_ad": false,
      "behot_time": 1604906551,
      "image_url": "//p1.pstatp.com/list/190x124/pgc-image/SDrYYXn2d0d3G4",
      "group_id": "6885295180975440392",
      "middle_image": "http://p1.pstatp.com/list/pgc-image/SDrYYXn2d0d3G4"
    },
    {
      "single_mode": false,
      "abstract": "\uff08\u4e00\uff09\u8003\u9a8c\u666e\u4eac\u7684\u65f6\u5019\u5230\u4e86\u3002\u7f8e\u56fd\u5927\u9009\u6c34\u843d\u77f3\u51fa\uff0c\u897f\u65b9\u56fd\u5bb6\u7eb7\u7eb7\u795d\u8d3a\u62dc\u767b\uff0c\u4f46\u4e0d\u5c11\u897f\u65b9\u5a92\u4f53\u6ce8\u610f\u5230\uff0c\u83ab\u65af\u79d1\u4e00\u76f4\u9759\u6084\u6084\u3002\u4ee5\u81f3\u4e8e\u6709\u4eba\u5404\u79cd\u731c\u6d4b\uff1a2016\u5e74\u7279\u6717\u666e\u5f53\u9009\uff0c\u666e\u4eac\u4e24\u4e2a\u5c0f\u65f6\u540e\u5c31\u53d1\u51fa\u795d\u8d3a\uff1b2020\u5e74\u62dc\u767b\u83b7\u80dc\uff0c\u666e\u4eac\u6574\u657424\u4e2a\u5c0f\u65f6\u540e\u6ca1\u4efb\u4f55\u52a8\u9759\u2026\u2026\u897f\u65b9\u4eba\u5f88\u8be7\u5f02\u3002",
      "middle_mode": true,
      "more_mode": false,
      "tag": "news_world",
      "comments_count": 13,
      "tag_url": "news_world",
      "title": "\u8003\u9a8c\u666e\u4eac\u7684\u65f6\u5019\u5230\u4e86",
      "chinese_tag": "\u56fd\u9645",
      "source": "\u4e2d\u56fd\u9752\u5e74\u7f51",
      "group_source": 2,
      "has_gallery": false,
      "media_url": "/c/user/token/MS4wLjABAAAAxvhRvfp8QotIo15bD0cWxFiKWMXaUldeG_Ep2unxBqM/",
      "media_avatar_url": "//p1-tt-ipv6.byteimg.com/large/pgc-image/66751ac333f147288e0fc3321bce0470",
      "source_url": "/group/6893001479863566855/",
      "article_genre": "article",
      "item_id": "6893001479863566855",
      "is_feed_ad": false,
      "behot_time": 1604905210,
      "image_url": "//p1.pstatp.com/list/pgc-image/SFoz6sU80CtTik",
      "group_id": "6893001479863566855",
      "middle_image": "http://p1.pstatp.com/list/pgc-image/SFoz6sU80CtTik"
    }
  ],
  "next": {
    "max_behot_time": 1604905210
  }
}
```

### Chrome 查看请求报文

![image-20220104113422895](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220104113422895.png)

## 6. HTTP 方法

- 常用的 HTTP 方法
- HTTP 方法的语义
- RESTful 接口设计

### 1.常用的 HTTP 方法

> 浏览器**发送请求时采用的方法**，和响应无关
>
> **GET、POST、PUT、DELETE**
>
> 用来定义对于资源采取什么样的操作的，有各自的语义

### 2.HTTP 方法的语义

> GET 获取数据 ===> ( 获取资源（文件）)
>
> POST 创建数据 ====> 注册
>
> PUT 更新数据 ===> 修改个人信息，修改密码
>
> DELETE 删除数据 ===> 删除一条评论
>
> **总结: 增删改查**
>
> 这些方法虽然有各自的语义，但是并不是强制性的

> GET 请求，没有请求体，数据通过请求头携带
>
> POST 请求，有请求体，数据可以通过请求体携带

```html
<form action="https://www.baidu.com" method="get">
  <input type="text" name="username" placeholder="用户名" />
  <input type="password" name="password" placeholder="密码" />
  <input type="submit" value="注册" />
</form>

<form action="https://www.baidu.com" method="post">
  <input type="text" name="username" placeholder="用户名" />
  <input type="password" name="password" placeholder="密码" />
  <input type="submit" value="注册" />
</form>
```

### 3.RESTful 接口设计

> 一种接口设计风格，充分利用 HTTP 方法的语义

**通过用户 ID 获取个人信息，使用 GET 方法**

```html
https://www.baidu.com/api/http/getUser?id=1
```

**注册新用户，使用 POST 方法**

```html
https://www.baidu.com/api/http/addUser
```

**修改一个用户，使用 POST 方法**

```
 https://www.baidu.com/api/http/modifyUser
```

**删除一个用户，使用 POST 方法**

```
https://www.baidu.com/api/http/deleteUser
```

**使用 RESTful 接口设计**

```js
//GET
https://www.baidu.com/api/http/user?id=1

//POST
https://www.baidu.com/api/http/user

//PUT
https://www.baidu.com/api/http/user

//DELETE
https://www.baidu.com/api/http/user
```

## 7. GET 和 POST 方法的对比

- 语义
- **发送数据**
- 缓存
- **安全性**

### 1.语义

> GET：获取数据
>
> POST：创建数据

### 2.发送数据

> GET 通过地址在请求头中携带数据
>
> 能携带的数据量和地址的长度有关系，一般最多就几 K

> POST 既可以通过地址在请求头中携带数据，也可以通过请求体携带数据
>
> 能携带的数据量理论上是无限的

**携带少量数据，可以使用 GET 请求，大量的数据可以使用 POST 请求**

### 3.缓存

> GET 可以被缓存，POST 不会被缓存

### 4.安全性

> GET 相对 POST 安全一点点
>
> 发送密码或其他敏感信息时不要使用 GET，主要是避免直接被他人窥屏或通过历史记录找到你的密码

## 8. https

- http 和 https
- 加密方式：对称加密，非对称加密
- https 证书

### 1.http 和 https

- http 是明文传输,敏感信息容易被中间劫持
- https=http+加密,劫持了也无法解密
- 现代浏览器已开始强制 https 协议

### 2.加密方式

- 对称加密： 一个 key 同负责加密、解密
- 非对称加密：一对 key,A 加密之后,只能用 B 来解密

![image-20220104124400185](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220104124400185.png)

![image-20220104124551817](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220104124551817.png)

- https 同时用到了这两种加密方式

![image-20220104124819271](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220104124819271.png)

### 3.https 证书

- 防止中间人攻击
- 使用第三方证书(慎用免费、不合规的证书)
- 浏览器校验证书

![image-20220104130406066](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220104130406066.png)

## 9.http 缓存

[移动端性能优化 - 掘金 (juejin.cn)](https://juejin.cn/post/7034458895279980552#heading-46)

## 总结

### 前后端通信

[![DHvYUH.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/DHvYUH.png)](https://imgchr.com/i/DHvYUH)

### 前后端的通信方式

> 使用浏览器访问网页
>
> link、img. script、a、form 等 HTML 的标签
>
> Ajax 和 Fetch

### HTTP 协议

> HTML、JS、CSS、图片等文件，都是通过 HTTP 在服务器和浏览器之间传输
>
> HTTP 是一个请求-响应协议

### HTTP 请求响应的过程

[![BTdoJx.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/BTdoJx.png)](https://imgchr.com/i/BTdoJx)](https://imgchr.com/i/BTdoJx)

### HTTP 报文

[![BTwXcT.png](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/BTwXcT.png)](https://imgchr.com/i/BTwXcT)

### HTTP 方法

> GET 获取数据
>
> PUT 更新数据
>
> POST 创建数据
>
> DELETE 删除数据

### GET 和 POST 方法的对比

> GET 表示获取数据，POST 表示创建数据
>
> GET 通过地址在请求头中携带数据
>
> POST 既可以通过地址在请求头中携带数据，也可以通过请求体携带数据
>
> GET 可以被缓存，POST 不会被缓存
>
> 发送密码或其他敏感信息时不要使用 GET

### HTTP 状态码

> 100~199 信息响应：代表请求已被接受，需要继续处理
>
> 200~299 成功响应
>
> 300~399 重定向
>
> 400~499 客户端错误
>
> 500~599 服务器错误

### HTTPS

> http 和 https
>
> 加密方式:对称加密,非对称加密
>
> https 证书
