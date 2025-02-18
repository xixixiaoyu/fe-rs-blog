引子：JS 基础知识：规定语法（ECMA 262 标准)，JS-Web-API：网页操作的 API ( W3C 标准 )，两者结合才能真正实际应用

## 1.DOM

DOM（Document Object Model 文档对象模型）本质：树结构

![image-20220307020156984](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307020156984.png)

![image-20220307020221916](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307020221916.png)

### 增删改查

获取：

| 方法                                   | 描述                         | 返回类型                       |
| -------------------------------------- | ---------------------------- | ------------------------------ |
| document.getElementById(id)            | 通过 id 获取元素             | 符合条件的元素                 |
| document.getElementsByTagName(tagName) | 通过标签名获取元素           | 符合条件的所有元素组成的类数组 |
| document.getElementsByClassName(class) | 通过 class 获取元素          | 符合条件的所有元素组成的类数组 |
| document.getElementsByName(name)       | 通过标签的属性 name 获取元素 | 符合条件的所有元素组成的类数组 |
| document.querySelector(选择器)         | 通过选择器获取元素           | 符合条件的第一个元素           |
| document.querySelectorAll(选择器)      | 通过选择器获取元素           | 符合条件的所有元素组成的类数组 |

注意：getElementById 和 getElementsByName（通过 name 属性获取元素）是必须以 document 开头的

操作：

| 标题                   | 描述                                            |
| ---------------------- | ----------------------------------------------- |
| createElement          | 创建一个标签节点                                |
| createTextNode         | 创建一个文本节点                                |
| createDocumentFragment | 创建一个文档碎片节点                            |
| cloneNode(deep)        | 复制一个节点，当 deep 为 true，则复制内部子节点 |
| appendChild            | 插入或者移动子节点                              |
| insertBefore           | 指定位置添加或者移动子节点                      |
| removeChild            | 删除子节点                                      |
| replaceChild           | 替换子节点                                      |
| createAttribute        | 创建对应属性                                    |
| setAttribute           | 设置节点属性                                    |
| getAttribute           | 获取节点属性                                    |
| romoveAttribute        | 删除节点属性                                    |
| ele.children           | 获取子元素列表（只考虑元素节点）                |
| ele.parentNode         | 获取父元素                                      |

### 优化 DOM 性能

![image-20220307115000310](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307115000310.png)

![image-20220307114952232](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307114952232.png)

### NodeList 和 HTMLCollection 区别

DOM 结构是一棵树，树的所有节点都是 `Node` ，包括：document，元素，文本，注释，fragment 等

`Element` 继承于 Node 。它是所有 html 元素的基类，如 `HTMLParagraphElement` `HTMLDivElement`

```js
class Node {}

// document
class Document extends Node {}
class DocumentFragment extends Node {}

// 文本和注释
class CharacterData extends Node {}
class Comment extends CharacterData {}
class Text extends CharacterData {}

// elem
class Element extends Node {}
class HTMLElement extends Element {}
class HTMLParagraphElement extends HTMLElement {}
class HTMLDivElement extends HTMLElement {}
// ... 其他 elem ...
```

HTMLCollection 是 Element 集合，它由获取 Element 的 API 返回

- `elem.children`
- `document.getElementsByTagName('p')`

NodeList 是 Node 集合，它由获取 Node 的 API 返回

- `elem.childNodes`
- `document.querySelectorAll('p')`

答案：

- HTMLCollection 是 Element 集合，NodeList 是 Node 集合
- Node 是所有 DOM 节点的基类，Element 是 html 元素的基类

注意：HTMLCollection 和 NodeList 都不是数组，而是“类数组”，可以转换为数组：

```js
const arr1 = Array.from(list);
const arr2 = Array.prototype.slice.call(list);
const arr3 = [...list];
```

### property 和 attribute 区别

DOM 节点本质上就是 JS 对象

![image-20220307114330891](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307114330891.png)

![image-20220307114340039](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307114340039.png)

- property：直接操作 DOM 对象
- attribute：直接改变 HTML 的属性
- 两者都可能引起页面重绘重排，影响性能

### DOM 事件模型

- 先经历从上到下的捕获阶段，再经历从下到上的冒泡阶段
- onxxx 这样的写法只能监听冒泡阶段
- ele.addEventListener("click", fn, true/false) 第三个参数可以选择阶段，true 为捕获模式
- 可以使用 event.stopPropagation() 来阻止捕获或冒泡

![image-20220307120527236](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307120527236.png)

![image-20220307120654054](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307120654054.png)

### 手写事件委托（代理）

- 本质就是利用事件冒泡机制，监听父元素

![image-20220307120721538](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307120721538.png)

[手写 DOM 监听（带委托）](http://yun.y2y7.com/doc/自定义工具函数.html#手写dom事件监听-带委托)

### 手写可拖拽 div

[可拖拽 div](http://yun.y2y7.com/doc/自定义工具函数.html#可拖拽div)

### offsetHeight scrollHeight clientHeight 区别

- offsetHeight offsetWidth：`border + padding + content`
- clientHeight clientWidth：` padding + content`
- scrollHeight scrollWidth：`padding + 实际内容的尺寸`
- scrollTop scrollLeft：`DOM 内部元素滚动的距离`

## 2.BOM

BOM（Brower Object Model 浏览器对象模型）代表浏览器本身的信息和操作，例如跳转和浏览器宽高等，基本就是一些 API

- 获取浏览器特性（即俗称的`UA`）然后识别客户端，例如判断是不是 Chrome 浏览器

```js
const ua = navigator.userAgent;
const isChrome = ua.indexOf("Chrome");
console.log(isChrome);
```

- 获取屏幕的宽度和高度

```js
console.log(screen.width);
console.log(screen.height);
```

- 获取网址、协议、path、参数、hash 等

```js
// 例如当前网址是 https://juejin.com/timeline/frontend?a=10&b=10#some
console.log(location.href); // https://juejin.com/timeline/frontend?a=10&b=10#some
console.log(location.protocol); // https:
console.log(location.pathname); // /timeline/frontend
console.log(location.search); // ?a=10&b=10
console.log(location.hash); // #some
```

- 调用浏览器的前进、后退功能等

```js
history.back();
history.forward();
```

## 3.Ajax

### XMLHttpRequest

> 手写封装 XMLHttpRequest 不借助任何库

![image-20220307152525381](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307152525381.png)

![image-20220307152418308](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307152418308.png)

[复杂一点手写 Ajax](http://yun.y2y7.com/doc/自定义工具函数.html#手写ajax请求函数)

### 同源策略和跨域

> 默认浏览器就遵守 **同源策略** ，即如果两个 URL 的协议、域名和端口都完全一致的话，则这两个 URL 是同源的
>
> 优点：保护用户隐私安全
>
> 缺点：当前端需要访问另一个域名的后端接口，很可能会被浏览器阻止其获取响应，比如甲站点通过 AJAX 访问乙站点的 /money 查询余额接口，请求会发出，但是响应会被浏览器屏蔽
>
> 但是不会限制`<link> <img> <script> <iframe>` 加载第三方资源

跨域解决策略：

1. JSONP (无法用户认证且只能发 get 请求)

   - 甲站点利用 script 标签可以跨域的特性，向乙站点发送 get 请求
   - 乙站点后端改造 JS 文件的内容，将数据传进回调函数
   - 甲站点通过回调函数拿到乙站点的数据

2. CORS（推荐）

   - 复杂跨域请求，如 PATCH ，则需要先响应 OPTIONS 预检请求，检查成功再响应 PATCH 请求

   - ```js
     Access-Control-Allow-Origin: https://甲站点
     Access-Control-Allow-Methods: POST, GET, OPTIONS, PATCH
     Access-Control-Allow-Headers: Content-Type
     ```

   - 如果需要附带身份信息，JS 中需要在 AJAX 里设置 `xhr.withCredentials = true`

   - 服务端设置这些即可

   - ```js
     // 第二个参数填写允许跨域的域名称，不建议直接写 "*"
     response.setHeader("Access-Control-Allow-Origin", "http://m.juejin.com/");
     response.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
     response.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");

     // 接收跨域的cookie
     response.setHeader("Access-Control-Allow-Credentials", "true");
     ```

### ajax fetch axios 的区别

- AJAX 就是浏览器与服务器之间的一种异步通信方式，在不重新加载整个页面的情况下，对页面的某部分进行更新，前期使用 XMLHttpRequest 进行 异步请求
- fetch 是一个原生 API ，它和 XMLHttpRequest 一个级别，但是写法更简洁（Promise 写法）
- axios 是一个第三方请求库，内部使用了 XMLHttpRequest

### Restful API

- 一种接口设计风格，充分利用 HTTP 方法的语义

```js
// GET 查询用户 100为用户id
https://www.baidu.com/api/http/user/100

// POST 新增用户 具体用户资料在 request body 里面
https://www.baidu.com/api/http/user

// PUT 更新全部内容， PATCH更新部分内容
https://www.baidu.com/api/http/user

//DELETE 删除用户 100为用户id
https://www.baidu.com/api/http/user/100
```

## 4.存储

### cookie

> 本意设计用在服务端和客户端信息传递的，因此每个 HTTP 请求携带 cookie，但是本身 HTTP 是无状态，可以使用 cookie 来帮助识别身份，跨域不共享
>
> 但同样 cookie 也具备浏览器端存储的能力，设置 `document.cookie = ....`即可，服务端可以 `set-cookie`
>
> 现代浏览器都开始禁用第三方 cookie （第三方 js 设置 cookie），打击第三方广告，保护用户个人隐私

缺点：

- 存储量太小，只有 4KB
- 所有 HTTP 请求都带着 cookie 数据，影响传输效率
- API 简单，需要封装才能用（js-cookie）

### localStorage 和 sessionStorage

> HTML5 标准专门为浏览器缓存设计

优点：

- 存储量增大到 5MB
- HTTP 请求不会携带
- API 简单好用 （setItem getItem removeItem clear）

### Cookie VS localStorage

- cookie 会被发送到服务器，而 localStorage 不会

- cookie 一般最大 4k，localStorage 可以用 5Mb 甚至 10Mb（各浏览器实现不同）

### localStorage VS sessionStorage

- localStorage 一般不会自动过期（除非用户手动清除）
- SessionStorage 在会话结束时过期（比如关闭浏览器）

### cookie VS session

- cookie 存在浏览器的文件里，session 实际数据存在服务器的文件里，session 就是服务端的一个 hash 表
- session 是基于 cookie 实现的，具体就是把 sessionID 存储到 cookie 中发送服务端，服务端据此找到存储数据

### token

token 和 cookie 一样，也是一段用于客户端身份验证的字符串，随着 http 请求发送

- cookie 是 http 协议规范的，而 token 是自定义的，可以用任何方式传输（如 header body query-string 等）
- token 默认不会在浏览器存储
- token 没有跨域限制

所以，token 很适合做跨域或者第三方的身份验证

### token 和 JWT（JSON Web Token）

JWT 的过程

- 前端输入用户名密码，传给后端
- 后端验证成功，返回一段 token 字符串 （ 将用户信息加密之后得到的）
- 前端获取 token 之后，存储下来
- 以后访问接口，都在 header 中带上这段 token

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/token.png" style="zoom:50%;" />

### cookie VS token

- cookie：http 规范，有跨域限制，可配合 session 实现登录
- token：自定义标准，无跨域限制，可用于 JWT 登录

### session VS JWT

#### Session

优点：

- 原理简单，易于学习
- 用户信息存储在服务端，可以快速封禁某个登录的用户 —— 有这方强需求的人，一定选择 Session

缺点：

- 占用服务端内存，有硬件成本
- 多进程、多服务器时，不好同步（ 一般使用第三方 redis 存储 ，成本高）
- 跨域传递 cookie ，需要特殊配置

#### JWT

优点：

- 不占用服务器内存
- 多进程、多服务器，不受影响
- 不受跨域限制

缺点：

- 无法快速封禁登录的用户
- 万一服务端秘钥被泄漏，则用户信息全部丢失
- token 体积一般大于 cookie ，会增加请求的数据量

#### 总结

- 如有严格管理用户信息的需求（保密、快速封禁）推荐 Session
- 如没有特殊要求，则使用 JWT（如创业初期的网站)

### 单点登录

#### 基于 cookie

- cookie 默认不可跨域共享，但有些情况下可设置为共享
- 主域名相同，如 `www.baidu.com` `image.baidu.com`
- 设置 cookie domain 为主域名`baidu.com`，即可共享 cookie

#### SSO

- 复杂一点的，滴滴这么潮的公司，同时拥有 `didichuxing.com` `xiaojukeji.com` `didiglobal.com` 等域名
- 主域名完全不同，则 cookie 无法共享
- 可使用 SSO 技术方案

<img src="https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/sso.png" style="zoom: 50%;" />

#### OAuth2

- OAuth 2.0 是目前最流行的授权机制，用来授权第三方应用，获取用户数据
- 其他常见的还有微信登录、github 登录等。即，当设计到第三方用户登录校验时，都会使用 OAuth2.0 标准

![image-20220227230535496](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220227230535496.png)
