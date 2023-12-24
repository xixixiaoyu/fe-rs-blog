引子：这东西我觉得有点难记，我以前做过此类详细文章，此篇既然是面试搞简单清楚点。

## 1.HTTP 状态码

- 1xx 服务器收到请求
- 2xx 请求成功
- 3xx 重定向
- 4xx 客户端请求错误
- 5xx 服务端错误

举例：200 成功 301 永久重定向 302、307 临时重定向 304 资源未被修改 400 客户端语法错误 401、403 没有权限

404 资源未找到 501 服务器不支持请求的功能，无法完成请求 504 网关超时

## 2.HTTP headers

### Request Headers

- Host 请求域名
- Accept 浏览器可接收的数据格式
- Accept-Encoding 浏览器可接收的压缩算法，如 gzip
- Accept-Languange 浏览器可接收的语言，如 zh-CN
- Connection: keep-alive 一次 TCP 连接重复使用
- Cookie
- User-Agent(简称 UA）浏览器信息
- Content-type 发送数据的格式，如 application/json

### Response Headers

- Content-type 返回数据的格式，如 application/json
- Content-length 返回数据的大小，多少字节
- Content-Encoding 返回数据的压缩算法，如 gzip
- Set-Cookie 服务端修改 Cookie

## 3.HTTP 缓存

![image-20220307165244725](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220307165244725.png)

强制缓存（expires 和 Cache-Control）

- expires 是时间戳，对本地时间戳太过依赖已被废弃
- Cache-Control:public，max-age=31536000（以秒单位），表现请求到后多少秒内被缓存，public 代表可被代理服务器缓存，默认值为 private 只能被浏览器缓存
- Cache-Control: no-store 禁止任务缓存策略， 设置 no-cache 则是强制进行协商缓存

协商缓存（last-modifed 和 ETag）

- last-modifed 是根据资源最后修改时间判断，如果编辑文件但没有修改或者文件修改速度过快，无法正常识别资源更新
- ETag 服务端生成的字符串（类似指纹），使用 ETag 可以进行更精准的变化感知，但生成 ETag 需要服务端付出额外开销
- 两者同时使用 ETag 优先级更高

| HTTP 协议 | 缓存（强缓存）                                                                      | 内容协商（弱缓存）                                  |
| --------- | ----------------------------------------------------------------------------------- | --------------------------------------------------- |
| HTTP 1.1  | Cache-Control: max-age=3600 <br />Etag: ABC                                         | If-None-Match: ABC 响应状态码：304 或 200           |
| HTTP 1.0  | Expires: Wed, 21 Oct 2015 02:30:00 GMT Last-Modified: Wed, 21 Oct 2015 01:00:00 GMT | If-Modified-Since: Wed, 21 O 响应状态码：304 或 200 |

面试可能还会提到 Pragma ，但 MDN 已经明确不推荐使用它

Tips：F5 手动刷新 ∶ 强制缓存失效，协商缓存有效。 ctrl + F5 强制刷新 ∶ 强制缓存失效，协商缓存失效

## 4.Get 和 Post 的区别

### 1.语义

- GET：获取数据
- POST：创建数据

### 2.发送数据

- GET 通过地址在请求头中携带数据，携带长度有限
- POST 既可以通过地址在请求头中携带数据，也可以通过请求体携带，理论上无限
- GET 产生一个 TCP 数据包，POST 产生两个或以上 TCP 数据包

### 3.幂等和缓存

- 由于 GET 是读，POST 是写，所以 GET 是幂等的，POST 不是幂等的
- GET 可以被缓存，POST 不会被缓存

### 4.安全性

- GET 和 POST 都不安全
- 发送敏感信息时不要使用 GET，避免别人窥屏或查找历史记录搜寻到

## 5.HTTP 和 HTTPS

1. HTTP 较快，HTTPS 较慢
2. HTTP 是明文传输的，不安全；HTTPS 是加密传输的，非常安全
3. HTTP 使用 80 端口，HTTPS 使用 443 端口
4. HTTPS 的证书一般需要购买（但也有免费的），HTTP 不需要证书

http 是对称加密， 一个 key 同负责加密、解密

https 采用了非对称加密：比如一开始传给客户端 pubkey 公钥，发送数据使用 pubkey 加密，但服务端会根据 pubkey 来使用 key 进行最终的解密

![image-20220104130406066](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/image-20220104130406066.png)

- https 中间人攻击，就是黑客劫持网络请求，伪造 CA 证书

![](https://raw.githubusercontent.com/xixixiaoyu/CloundImg2/main/%E4%B8%AD%E9%97%B4%E4%BA%BA%E6%94%BB%E5%87%BB.jpeg)

解决方案：使用浏览器可识别的，正规厂商的证书（如阿里云），慎用免费证书

## 6.HTTP 1.0 / 1.1 / 2

### HTTP 1.0

- 最基础的 HTTP 协议
- 支持基本的 GET POST 方法

### HTTP/1.1

- 使用 Connection: keep-alive 开启 TCP 长连接，多次 HTTP 请求响应可在同一个通道进行
- 引入更多的缓存策略，如 `cache-control` `E-tag`
- 断点续传，采用流模式处理数据，产生一块数据，发送一块数据
- 请求被一个个回应，容易造成对头堵塞
- 增加新的 method `PUT` `DELETE` 等，可以设计 Restful API

### HTTP/2

- 头信息压缩机制
- 多路复用，从单车道变成了几百个双向通行的车道，所以每个数据都标记了独一的 ID 方便区分
- 二进制传输，而且将 head 和 body 分成帧来传输；HTTP/1.1 是 符串传输
- 支持服务器推送，允许服务器未经请求，主动向客户端发送资源

## 7.TCP 三次握手和四次挥手

### 建立 TCP 连接时 server 与 client 会经历三次握手

1. 浏览器向服务器发送 TCP 数据：SYN(seq=x)
2. 服务器向浏览器发送 TCP 数据：ACK(seq=x+1) SYN(y)
3. 浏览器向服务器发送 TCP 数据：ACK(seq=y+1)

### 关闭 TCP 连接时 server 与 client 会经历四次挥手

1. 浏览器向服务器发送 TCP 数据：FIN(seq=x)
2. 服务器向浏览器发送 TCP 数据：ACK(seq=x+1)
3. 服务器向浏览器发送 TCP 数据：FIN(seq=y)
4. 浏览器向服务器发送 TCP 数据：ACK(seq=y+1)

为什么 2、3 步骤不合并起来呢？因为 2、3 中间服务器很可能还有数据要发送，不能提前发送 FIN

## 8.HTTP 和 UDP

- HTTP 在应用层，而 UDP 和 TCP 在传输层
- HTTP 是有连接的、可靠的，UDP 是无连接的、不可靠的，但效率高（适合视频语音）

## 9.webSocket

- webSocket 和 http 都是应用层，支持端对端的通讯。可以由服务端发起，也可以由客户端发起
- 会先发起一个 http 请求，根服务端建立连接。连接成功之后再升级为 webSocket 协议，然后再通讯
- 场景：消息通知，直播讨论区，聊天室，协同编辑

PS：`ws` 可以升级为 `wss` 协议，像 `http` 升级到 `https` 一样，增加 `SSL` 安全协议，如果做项目开发，推荐使用 [socket.io](https://www.npmjs.com/package/socket.io)，API 更方便

### webSocket VS http

- 协议名称不同 `ws` 和 `http`
- http 一般只能浏览器发起请求，webSocket 可以双端发起请求
- webSocket 无跨域限制
- webSocket 通过 `send` 和 `onmessage` 进行通讯，http 通过 `req` 和 `res` 通讯

### webSocket VS 长轮询

- http 长轮询 - 客户端发起 http 请求，server 不立即返回，等待有结果再返回。这期间 TCP 连接不会关闭，阻塞式。（需要处理 timeout 的情况）
- webSocket - 客户端发起请求，服务端接收，连接关闭。服务端发起请求，客户端接收，连接关闭。非阻塞

## 10.网页多标签页之间的通讯

场景：例如打开两个 chrome 标签，一个访问列表页，一个访问详情页。在详情页修改了标题，列表页也要同步过来

答案：

- webSocket 需要服务端参与，但不限制跨域
- localStorage 简单易用
- SharedWorker 本地调试不太方便，考虑浏览器兼容性

### 1.webSocket

- 通过 webSocket 多页面通讯，无跨域限制，但需要服务端同步，成本高

### 2.localStorage

- **同域**的两个页面，可以通过 localStorage 通讯。A 页面可以监听到 B 页面的数据变化

```js
// list 页面
window.addEventListener("storage", (event) => {
  console.log("key", event.key);
  console.log("newValue", event.newValue);
});

// detail 页面
localStorage.setItem("changeInfo", "xxx");
```

### 3.SharedWorker

- Javascript 是单线程的，而且和页面渲染线程互斥。所以，一些计算量大的操作会影响页面渲染
- [WebWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Using_web_workers) 可以 `new Worker('xxx.js')` 用来进行 JS 计算，不支持 DOM 操作，并通过 `postMessage` 和 `onmessage` 和网页通讯，但这个 worker 是当前页面专有的，不得多个页面、iframe 共享，
- [SharedWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/SharedWorker) 可以被**同域**的多个页面共享使用，也可以用于通讯，注意，worker 中的日志需要 `chrome://inspect` 中打开控制台查看

```js
// 初始化work.js
const set = new Set();

onconnect = (event) => {
  const port = event.ports[0];
  set.add(port);

  // 接收信息
  port.onmessage = (e) => {
    // 广播消息
    set.forEach((p) => {
      if (p === port) return;
      p.postMessage(e.data);
    });
  };

  // 发送信息
  port.postMessage("worker.js done");
};

// 监听A页面
const worker = new SharedWorker("./worker.js");

const btn1 = document.getElementById("btn1");
btn1.addEventListener("click", () => {
  console.log("clicked");
  worker.port.postMessage("detail go...");
});

// 监听B页面
const worker = new SharedWorker("./worker.js");
worker.port.onmessage = (e) => console.info("list", e.data);
```

### iframe 通讯

- 除了上述几个方法，iframe 通讯最常用 [window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage) ，支持跨域
- 通过 `window.postMessage` 发送消息。注意第二个参数，可以限制域名，如发送敏感信息，要限制域名

```js
// 父页面向 iframe 发送消息
window.iframe1.contentWindow.postMessage("hello", "*");

// iframe 向父页面发送消息
window.parent.postMessage("world", "*");
```

可监听 `message` 来接收消息。可使用 `event.origin` 来判断信息来源是否合法，可选择不接受：

```js
window.addEventListener("message", (event) => {
  console.log("origin", event.origin); // 通过 origin 判断是否来源合法
  console.log("child received", event.data);
});
```
