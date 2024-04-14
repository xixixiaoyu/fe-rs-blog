# EJS模板引擎



## 1.介绍

> EJS是一个高效的 JavaScript 模板引擎。
>
> 模板引擎是为了使用户界面与业务数据（内容）分离而产生的。
>
> 简单来说，使用EJS模板引擎就能动态渲染数据。



## 2.EJS的使用

> 1) 下载安装
>
>    npm i ejs
>
> 2) 配置模板引擎
>
>    app.set("view engine" , "ejs");
>
> 3) 配置模板的存放目录
>
>    app.set("views","./views")
>
> 4) 在views目录下创建模板文件
>
>    xxx.ejs
>
> 5) 使用模板，通过response来渲染模板
>
>    response.render(‘模板名称’, 数据对象)



### 1.变量的拼接

```js
//1. 安装 ejs
//2. 引入 ejs
const ejs = require("ejs");
const fs = require("fs");

/**
 * str    要编译的字符串
 * data   数据对象
 */

let html = fs.readFileSync("./views/index.html").toString();
let data = {
    msg: "为荣耀而生，为荣誉而死",
    title: "标题",
};
//3. 调用方法
const result = ejs.render(html, data);
```

```html
// index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title><%= title %></title>
  </head>
  <body>
    <h1><%= msg %></h1>
  </body>
</html>
```



### 2.数据的遍历

```js
const ejs = require("ejs");
const fs = require("fs");
let str = fs.readFileSync('./views/songs.html').toString();
let data = {
    songs: [
        '甜蜜蜜',
        '笨小孩',
        '常回家看看',
        '难忘今宵',
        '好运来'
    ]
};
let result = ejs.render(str, data);
```



```html
// songs.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>歌曲列表</title>
    <style>
        body{
            background:#ace;
        }
    </style>
</head>
<body>
    <h2>歌曲列表</h2>
    <ul>
        <% for(let i=0;i<songs.length;i++){ %>
        <li><%= songs[i] %></li>
        <% } %>
    </ul>
</body>
</html>
```



结合Express使用

```js
const express = require("express");
const app = express();
const ejs = require("ejs");
const fs = require("fs");
//静态资源服务
app.use(express.static("./public"));
//显示歌曲列表
app.get("/songs", (request, response) => {
  //字符串参数
  let str = fs.readFileSync("./views/歌曲列表.html").toString();
  //数据对象
  let data = {
    songs: ["甜蜜蜜", "笨小孩", "常回家看看", "难忘今宵", "好运来"],
  };
  //编译内容
  let result = ejs.render(str, data);
  //响应
  response.send(result);
});

app.listen(80);
```





### 3.判断

```js
//三. 判断
let str = `
    <h2>布布TV</h2>
    <% if(!vip){ %>
    <p><%= ad %></p>
    <% } %>
`;
const result = ejs.render(str, {
    vip: 0,
    ad: "不是每一滴牛奶, 都叫特仑苏",
});

console.log(result);
```



ejs在express使用

```js
//选手数据
const player = [
  { id: 1, name: "xiaoming" },
  { id: 2, name: "xiaoning" },
  { id: 3, name: "xiaotian" },
  { id: 4, name: "knight" },
];

//引入 express 包
const express = require("express");
//创建应用对象
const app = express();
//1. 设置 express 使用的模板引擎 ejs
app.set("view engine", "ejs"); // pug
//设置 ejs 使用的模板的存放位置   模板指的就是 HTML 代码存放的文件
app.set("views", "./template");

//路由的设置
app.get("/player", (request, response) => {
  //2. 到指定的文件夹下创建模板文件
  //3. 设置模板响应  使用 ejs 编译 ./template/player.ejs 文件中的内容
  response.render("player", { player: player });
});
//监听端口 启动服务
app.listen(80, () => {
  console.log("服务已经启动.. 端口 80 监听中....");
});
```



```ejs
// template/player.ejs
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>选手列表</title>
        <style>
            table{
                border-collapse: collapse;
            }
            td{
                padding:10px 20px;
            }
        </style>
    </head>
    <body>
        <h2>职业选手</h2>
        <table border="1">
            <tr><td>ID</td><td>名字</td></tr>
            <% for(let i=0;i<player.length;i++){ %>
            <tr><td><%= player[i].id %></td><td><%= player[i].name %></td></tr>
            <% } %>
        </table>
    </body>
</html>
```





# art-template



## 1.介绍

> art-template 是一个简约、超快的模板引擎。
>
> 它采用作用域预声明的技术来优化模板渲染速度，从而获得接近 JavaScript 极限的运行性能，并且同时支持 NodeJS 和浏览器。
>
> 官方文档 http://aui.github.io/art-template/zh-cn/docs/

## 2.使用

如果没有模板引擎需要手动拼接

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>模板引擎--art-template</title>
  </head>
  <body>
    <p>学生信息表</p>
    <ul id="list"></ul>

    <script>
      // 学生数据
      const students = [
        {
          name: "Alex",
          age: 18,
          sex: "male",
        },
        {
          name: "张三",
          age: 28,
          sex: "male",
        },
        {
          name: "李四",
          age: 20,
          sex: "female",
        },
      ];

        // 1.使用模板字符串
        const list = document.getElementById('list');

        let html = '';

        for (const student of students) {
            html += `<li>${student.name} ${student.sex} ${student.age}</li>`;
        }

        list.innerHTML = html;
    </script>
  </body>
</html>

```



使用模板引擎

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>模板引擎--art-template</title>
  </head>
  <body>
    <p>学生信息表</p>
    <ul id="list"></ul>

    <script src="https://unpkg.com/art-template@4.13.2/lib/template-web.js"></script>

    <script id="tpl-students" type="text/html">
      {{each students}}
      <li>{{$value.name}} {{$value.age}} {{$value.sex}}</li>
      {{/each}}
    </script>

    <script>
      // 学生数据
      const students = [
        {
          name: "Alex",
          age: 18,
          sex: "male",
        },
        {
          name: "张三",
          age: 28,
          sex: "male",
        },
        {
          name: "李四",
          age: 20,
          sex: "female",
        },
      ];

 

      // list.innerHTML = html;

      // 1.使用模板引擎--art-template
      // 1.1.引入 art-template

      // 1.2.准备好模板

      // 1.3.获取模板
      // console.log(
      //   template('tpl-students', {
      //     students
      //   })
      // );
      const list = document.getElementById("list");

      // 模板引擎输出的是字符串，是填充了数据的字符串
      list.innerHTML = template("tpl-students", {
        students,
      });
    </script>
  </body>
</html>
```



### 1.输出

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>art-template 的语法</title>
  </head>
  <body>
    <div id="content"></div>

    <script src="https://unpkg.com/art-template@4.13.2/lib/template-web.js"></script>

    <!-- 1.输出 -->
    <script id="tpl-1" type="text/html">
      {{value}}<br />
      {{data}}<br />
      {{data.key}}<br />
      {{data['key']}}<br />
	  运算
      {{a+b}}<br />
	  $data为传递的整个对象
      {{$data}}<br />
      {{$data.value}}<br />
      {{$data.data}}<br />
	  @ text解析HTML标签
      {{text}}
      {{@ text}}
    </script>

   

      <script>
          // 1.输出
          // 优先使用标准语法，标准语法不能解决的，再使用原始语法
          const content = document.getElementById("content");

          // 参数要放在对象中，即使没有参数，也要传空对象
          content.innerHTML = template("tpl-1", {
              value: 1,
              data: {
                  key: 2,
              },
              a: 3,
              b: 4,
              // 原文输出语句不会对 HTML 内容进行转义处理
              text: "<strong>重点内容</strong>",
          });
      </script>
  </body>
</html>
```



### 2.条件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>art-template 的语法</title>
  </head>
  <body>
    <div id="content"></div>

    <script src="https://unpkg.com/art-template@4.13.2/lib/template-web.js"></script>

 <!-- 2.条件 -->
    <script id="tpl-2" type="text/html">
      {{if sex === 'male'}} 
      男 
      {{else if sex === 'female'}} 
      女 
      {{else}} 
      其他 
      {{/if}}
    </script>


      <script>
          // 2.条件
          const content = document.getElementById('content');
          content.innerHTML = template('tpl-2', {
              // sex: 'male'
              // sex: 'female'
              sex: 'other'
          });

      </script>
  </body>
</html>
```





### 3.循环

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>art-template 的语法</title>
  </head>
  <body>
      <ul id="list"></ul>
    <script src="https://unpkg.com/art-template@4.13.2/lib/template-web.js"></script>

 <!-- 3.循环 -->
      <script id="tpl-2" type="text/html">
     {{each students}}
     $value为每一项的值,$index为索引,$data为传递的整个数据
      <li>{{$value.name}} {{$value.age}} {{$value.sex}} {{$index}} {{$data}}</li>
      {{/each}}
      </script>


      <script>
          // 3.循环
          const students = [
              {
                  name: 'Alex',
                  age: 18,
                  sex: 'male'
              },
              {
                  name: '张三',
                  age: 28,
                  sex: 'male'
              },
              {
                  name: '李四',
                  age: 20,
                  sex: 'female'
              }
          ];
          const list = document.getElementById('list');
          list.innerHTML = template('tpl-3', {
              // students: students
              students
          });
      </script>
  </body>
</html>
```



### 4.子模板语法

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>art-template 的语法</title>
    </head>
    <body>
        <div id="content"></div>
        <br />
        <div id="otherContent"></div>

     

        <script src="https://unpkg.com/art-template@4.13.2/lib/template-web.js"></script>

        <!-- 4.子模板 -->
    <script id="tpl-4" type="text/html">
      {{include 'tpl-4-header'}}

      <p>首页</p>

      {{include 'tpl-4-footer'}}
    </script>

    <script id="tpl-4-header" type="text/html">
      <header>我是公共头部</header>
    </script>
    <script id="tpl-4-footer" type="text/html">
      <footer>我是公共底部</footer>
    </script>
	
     <!-- 向子模板传参 -->
    <script id="tpl-4-2-header" type="text/html">
      <header>我是{{page}}公共头部</header>
    </script>
    <script id="tpl-4-2-footer" type="text/html">
      <footer>我是{{page}}公共底部</footer>
    </script>

    <script id="tpl-4-2-index" type="text/html">
      <% include('tpl-4-2-header', {page:'首页'}) %>

      <p>首页</p>

      <% include('tpl-4-2-footer', {page:'首页'}) %>
    </script>

    <script id="tpl-4-2-list" type="text/html">
      <% include('tpl-4-2-header', {page:'列表页'}) %>

      <p>列表页</p>

      <% include('tpl-4-2-footer', {page:'列表页'}) %>
    </script>

      <script>
         // 4.子模板
          const content = document.getElementById("content");
          // 即使没有参数，也要传空对象
          content.innerHTML = template("tpl-4", {});

          // 向子模板传参
          // 如果需要向子模板传参，请使用原始语法
          const content = document.getElementById("content");
          content.innerHTML = template("tpl-4-2-index", {});
          const otherContent = document.getElementById("otherContent");
          otherContent.innerHTML = template("tpl-4-2-list", {});
      </script>
  </body>
</html>
```

